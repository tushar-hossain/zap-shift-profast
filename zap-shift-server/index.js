require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);
const admin = require("firebase-admin");
const serviceAccount = require("./firebase_token.json");
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const veryFyFBToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "forbidden access" });
  }
};

app.get("/", (req, res) => {
  res.send("Parcel server is running");
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const parcelCollection = client.db("parcelDB").collection("parcels");
    const paymentCollection = client.db("parcelDB").collection("payments");
    const usersCollection = client.db("parcelDB").collection("users");
    const ridersCollection = client.db("parcelDB").collection("riders");

    // verify admin token
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const user = await usersCollection.findOne({ email });
      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // users api
    app.post("/users", async (req, res) => {
      const { email } = req.body;

      const userExits = await usersCollection.findOne({ email });
      if (userExits) {
        return res
          .status(200)
          .send({ message: "already exists user", inserted: false });
      } else {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        res.send(result);
      }
    });

    // Search user by email form users
    app.get("/users/search", async (req, res) => {
      const emailQuery = req.query.email;
      if (!emailQuery) {
        return res.status(404).send({ message: "missing email query" });
      }

      // partial match
      const regex = new RegExp(emailQuery, "i");

      try {
        const users = await usersCollection
          .find({ email: { $regex: regex } })
          .project({ email: 1, create_at: 1, role: 1 })
          .limit(10)
          .toArray();
        res.send(users);
      } catch (error) {}
    });

    // get user role by email
    app.get("/users/:email/role", veryFyFBToken, async (req, res) => {
      try {
        const email = req.params.email;
        if (!email) {
          return res.status(400).send({ message: "Email is required" });
        }
        const user = await usersCollection.findOne({ email });

        if (!user) {
          return res.status(404).send({ message: "User not found" });
        }

        res.send({ role: user.role || "user" });
      } catch (error) {
        res.status(500).send({ message: "Failed to update user role." });
      }
    });

    // Update users role
    app.patch(
      "/users/:id/role",
      veryFyFBToken,
      verifyAdmin,
      async (req, res) => {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "user"].includes(role)) {
          return res.status(400).send({ message: "Invalid role" });
        }

        try {
          const result = await usersCollection.updateOne(
            {
              _id: new ObjectId(id),
            },
            { $set: { role } }
          );
          res.send(result);
        } catch (error) {
          res.status(500).send({ message: "Failed to update user role." });
        }
      }
    );

    // get all Parcels and email parcels data
    app.get("/parcels", veryFyFBToken, async (req, res) => {
      try {
        const userEmail = req.query.email;

        if (req.decoded.email !== userEmail) {
          return res.status(403).send({ message: "forbidden access" });
        }

        const query = userEmail
          ? {
              created_by: userEmail,
            }
          : {};
        const option = {
          sort: { createdAt: -1 },
        };

        const result = await parcelCollection.find(query, option).toArray();
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed a get parcels" });
      }
    });

    // assign able parcel
    app.get("/parcels/assignable", async (req, res) => {
      const result = await parcelCollection
        .find({
          payment_status: "paid",
          delivery_status: "not_collected",
        })
        .sort({ creation_date: -1 })
        .toArray();

      res.send(result);
    });

    // GET parcel by ID
    app.get("/parcels/:id", async (req, res) => {
      try {
        const parcel = await parcelCollection.findOne({
          _id: new ObjectId(req.params.id),
        });

        res.status(200).send(parcel);
      } catch (err) {
        res.status(500).json({ message: "Server error" });
      }
    });

    // Post parcels
    app.post("/parcels", async (req, res) => {
      const query = req.body;
      const result = await parcelCollection.insertOne(query);
      res.send(result);
    });

    // parcel assign

    app.patch("/parcels/:id/assign", async (req, res) => {
      const { riderId } = req.body;
      const result = await parcelCollection.updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { assigned_rider: riderId, delivery_status: "assigned" } }
      );
      res.send(result);
    });

    // DELETE /api/parcels/:id
    app.delete("/parcels/:id", async (req, res) => {
      const parcelId = req.params.id;

      if (!ObjectId.isValid(parcelId)) {
        return res.status(400).json({ message: "Invalid parcel ID" });
      }

      try {
        const result = await parcelCollection.deleteOne({
          _id: new ObjectId(parcelId),
        });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Parcel not found" });
        }

        res.status(200).send(result);
      } catch (error) {
        console.error("Error deleting parcel:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    // POST /api/trackings
    app.post("/api/trackings", async (req, res) => {
      const trackingUpdate = {
        trackingId: req.body.trackingId,
        status: req.body.status,
        location: req.body.location || "",
        note: req.body.note || "",
        updated_by: req.body.updated_by || "system",
        timestamp: new Date().toISOString(),
      };

      try {
        const result = await db
          .collection("tracking")
          .insertOne(trackingUpdate);
        res.send({ success: true, id: result.insertedId });
      } catch (err) {
        res.status(500).send({ success: false, error: err.message });
      }
    });

    // get active riders
    app.get("/riders", async (req, res) => {
      const { district } = req.query;
      const riders = await ridersCollection
        .find({
          district,
          status: "active",
        })
        .project({ name: 1, phone: 1 })
        .toArray();

      console.log(riders);

      res.send(riders);
    });

    // GET /riders/active
    app.get("/riders/active", veryFyFBToken, verifyAdmin, async (req, res) => {
      try {
        // const active = req.body;
        const result = await ridersCollection
          .find({
            status: "active",
          })
          .toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching pending riders:", error);
        res.status(500).json({ message: "Failed to load active riders" });
      }
    });

    // GET /riders/pending
    app.get("/riders/pending", veryFyFBToken, verifyAdmin, async (req, res) => {
      try {
        const pendingRiders = await ridersCollection
          .find({ status: "pending" })
          .sort({ _id: -1 })
          .toArray();

        res.status(200).send(pendingRiders);
      } catch (error) {
        console.error("Error fetching pending riders:", error);
        res.status(500).json({ message: "Failed to load pending riders" });
      }
    });

    // PATCH /riders/active
    app.patch("/riders/:id", async (req, res) => {
      const riderId = req.params.id;
      const { status, email } = req.body;
      try {
        const result = await ridersCollection.updateOne(
          {
            _id: new ObjectId(riderId),
          },
          {
            $set: { status: status },
          }
        );

        if (status === "active") {
          const filter = { email };
          const updateDoc = {
            $set: { role: "rider" },
          };

          const roleResult = await usersCollection.updateOne(filter, updateDoc);

          console.log(roleResult);
        }

        res.send(result);
      } catch (error) {
        console.error("Error updating rider status:", error);
        res.status(500).send({ success: false, message: "Server error" });
      }
    });

    // delete
    app.delete("/riders/:id", async (req, res) => {
      const riderId = req.params.id;
      const filter = {
        _id: new ObjectId(riderId),
      };
      const updateDoc = {
        $set: {
          status: "cancel",
        },
      };
      const result = await ridersCollection.deleteOne(filter, updateDoc);
      res.send(result);
    });

    // POST /api/riders
    app.post("/riders", async (req, res) => {
      const result = await ridersCollection.insertOne(req.body);
      res.send(result);
    });

    // GET payments?email
    app.get("/payments", veryFyFBToken, async (req, res) => {
      const userEmail = req.query.email;

      if (req.decoded.email !== userEmail) {
        return res.status(403).json({ message: "forbidden access" });
      }

      const query = userEmail ? { email: userEmail } : {};
      const options = { paid_at: -1 };

      const payments = await paymentCollection.find(query, options).toArray();

      res.status(200).send(payments);
    });

    // POST payments/success
    app.post("/payments", async (req, res) => {
      const { parcelId, email, amount, paymentMethod, transactionId } =
        req.body;

      try {
        // 1. Update parcelCollection
        const updateResult = await parcelCollection.updateOne(
          { _id: new ObjectId(parcelId) },
          { $set: { payment_status: "paid" } }
        );

        if (updateResult.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "Parcel not found or already paid" });
        }

        // 2. Insert into paymentCollection
        const paymentDoc = {
          parcelId,
          email,
          amount,
          paymentMethod,
          transactionId,
          status: "paid",
          paid_at_string: new Date().toISOString(),
          paid_at: new Date(),
        };

        const paymentResult = await paymentCollection.insertOne(paymentDoc);

        res.status(201).send({
          message: "Payment recorded successfully",
          insertedId: paymentResult.insertedId,
        });
      } catch (error) {
        console.error("Payment Success Error:", error);
        res.status(500).json({ message: "Server error" });
      }
    });

    // payment post methods
    app.post("/create-payment-intent", async (req, res) => {
      try {
        const amountInCent = req.body.amountInCent;

        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCent, // Amount in cents
          currency: "usd",
          payment_method_types: ["card"],
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
