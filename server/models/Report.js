import mongoose from 'mongoose';

const scoreDetailSchema = new mongoose.Schema(
  {
    score: {
      type: Number,
      default: 0,
    },
    metrics: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    level: {
      type: String,
    },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
      trim: true,
    },
    bio: {
      type: String,
      default: '',
      trim: true,
    },
    joinDate: {
      type: Date,
    },
    websiteUrl: {
      type: String,
      default: '',
    },
    publicEmail: {
      type: String,
      default: '',
    },
    followers: {
      type: Number,
      default: 0,
    },
    publicRepos: {
      type: Number,
      default: 0,
    },
    scores: {
      activity: {
        type: scoreDetailSchema,
        default: () => ({}),
      },
      codeQuality: {
        type: scoreDetailSchema,
        default: () => ({}),
      },
      diversity: {
        type: scoreDetailSchema,
        default: () => ({}),
      },
      community: {
        type: scoreDetailSchema,
        default: () => ({}),
      },
      hiringReadiness: {
        type: scoreDetailSchema,
        default: () => ({}),
      },
      overall: {
        type: scoreDetailSchema,
        default: () => ({}),
      },
    },
    topRepos: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    languages: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    heatmapData: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    shareUrl: {
      type: String,
      default: '',
    },
    cachedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
      index: {
        expires: 0,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.models.Report || mongoose.model('Report', reportSchema);

export default Report;
