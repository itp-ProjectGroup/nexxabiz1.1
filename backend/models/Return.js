import mongoose from 'mongoose';

// Helper for auto-incrementing ret_Id
let counter = 1;
async function generateRetId() {
  const ReturnModel = mongoose.models.Return || mongoose.model('Return', ReturnSchema);
  const last = await ReturnModel.findOne().sort({ _id: -1 });

  if (last && last.ret_Id) {
    const lastNum = parseInt(last.ret_Id.replace('RID', '')) || 0;
    counter = lastNum + 1;
  }

  const padded = String(counter).padStart(6, '0');
  return `RID${padded}`;
}

const ReturnSchema = new mongoose.Schema({
  ret_Id: {
    type: String,
    unique: true
  },
  ret_date: {
    type: Date,
    required: true
  },
  pay_status: {
    type: String,
    default: 'Return'
  },
  od_items: [
    {
      manufacturingID: {
        type: String,
        required: true
      },
      qty: {
        type: Number,
        required: true
      }
    }
  ],
  userID: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Auto-generate ret_Id before saving
ReturnSchema.pre('save', async function (next) {
  if (!this.ret_Id) {
    this.ret_Id = await generateRetId();
  }
  next();
});

const Return = mongoose.model('Return', ReturnSchema);
export default Return;
