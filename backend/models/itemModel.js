import mongoose from 'mongoose';

const itemSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['lost', 'found'],
    },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true }, // Path to the image
    contactName: { type: String, required: true },
    contactEmail: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'claimed'],
      default: 'open',
    },
  },
  { timestamps: true }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;