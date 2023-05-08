import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

import connect from '../../../lib/database/database';
import posts from '../../../lib/database/models/posts';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return res.redirect('/');

    if (req.body) {
        const session = await getServerSession(req, res, authOptions);
        if (!session) return res.status(403).end();
        console.log(session)
        await connect();

        await posts.create({
            category: req.body.category,
            question: req.body.question,
            postedBy: {
                userid: session.user.userid,
                name: session.user.username
            },
            postedAt: Date.now()
        })
        res.status(200).end();
    }
}