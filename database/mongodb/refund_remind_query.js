db.refund.aggregate([
  {
    $lookup: {
      from: "refund_tracks",
      localField: "_id",
      foreignField: "thing",
      as: "refundTracks" // Alias for the joined documents
    }
  },
  {
    $unwind: {
      path: "$refundTracks", // Unwind refundDetails array
      preserveNullAndEmptyArrays: true // Optional: Include refund_tracks without matching refunds
    }
  },
  {
    $lookup: {
      from: "refund_reminds",
      localField: "_id",
      foreignField: "thing",
      as: "reminds" // Alias for joined refund_reminds documents
    }
  },
  {
    $unwind: {
      path: "$reminds", // Unwind refundReminds array
      preserveNullAndEmptyArrays: true // Include documents without refundReminds
    }
  },  
  {
    $match: {
      $and: [
        { state: { $eq: "GENERATED" } },
        { "remindRules.expiresAt": { $gt: new Date() } },
        {
          $or: [
            { "reminds": null },
            { "reminds.nextPoll": { $lt: new Date() } }
          ]
        },
        { "refundTracks.steps.0.state": "PENDING" },
        { "refundTracks.steps.0.oneTimeCode.status": { $in: ["CREATED", "CONFIRMED"] } },
      ]
    }
  },
  {
    $project: {
      _id: 1,
      qrEndpoint: 1,
      fields: 1,
      recipients: 1,
      remindRules: 1,
      carrier: 1,
      information: 1,
      company: 1,
      customer: 1,
      directions: 1,
      createdAt: 1,
      changedAt: 1,
      oneTimeCode: { $arrayElemAt: ["$refundTracks.steps.oneTimeCode", 0] },
      "reminds": 1
    }
  },
  { $limit: 1 }
])
// .limit(1);

// db.refund.find({
//     state: "GENERATED",
//     "reminds.expiresAt": { $gt: new Date() }
// })
// .projection({
//     _id: 1,
//     fields: 1,
//     "reminds.expiresAt": 1
// })
// .sort({ "reminds.expiresAt": 1 })
// .limit(0)