db.refund_tracks.aggregate([
  {
    $lookup: {
      from: "refund", // Collection to join (Refund collection)
      localField: "thing", // Field in refund_tracks that references Refund
      foreignField: "_id", // Field in refund to match
      as: "refund" // Alias for the joined documents
    }
  },
  {
    $unwind: {
      path: "$refund", // Unwind refundDetails array
      preserveNullAndEmptyArrays: true // Optional: Include refund_tracks without matching refunds
    }
  },
  {
    $match: {
      $and: [
        {
          changedAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 3)) // Last 3 days
          }
        },
        {
          "refund.state": "GENERATED" // Match refund state
        },
        {
          "steps.state": "PENDING" // Match steps state
        }
      ]
    }
  },
  {
    $project: {
      _id: 1,
      steps: 1,
      createdAt: 1,
      changedAt: 1,
      "refund._id": 1,
      "refund.state": 1
    }
  }
]).limit(1);
