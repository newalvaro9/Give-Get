import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]"

import connect from '../../../../lib/database/database';
import posts from '../../../../lib/database/models/posts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.redirect('/');

    if (req.body) {
        const session = await getServerSession(req, res, authOptions);
        if (!session) return res.status(403).end();
        await connect();
        
        const post = await posts.findOne({ postid: req.body.postid });
        if(!post) return res.status(404).end();
        if(post.postedBy.userid !== session.user.userid) return res.status(403).end();

        await posts.findOneAndDelete({ postid: req.body.postid });
        res.status(200).end();
    }
}