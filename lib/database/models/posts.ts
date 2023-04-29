import mongoose from "mongoose";

const Posts = new mongoose.Schema({
    postid: {
        type: Number,
        required: true
    },
    postedBy: {
        userid: {
            type: Number,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    postedAt: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    }
});

Posts.pre('save', async function (next) {
    if (this.isNew) {
        const count = await mongoose.model('Posts').countDocuments();
        this.postid = count + 1;
    }
    next();
});

export default mongoose.models.Posts || mongoose.model('Posts', Posts)