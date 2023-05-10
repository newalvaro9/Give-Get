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

        await posts.findOneAndUpdate(
            { postid: req.body.postid },
            {
                $push: {
                    answers: {
                        $each: [
                            {
                                postedBy: {
                                    userid: session.user.userid,
                                    name: session.user.username
                                },
                                postedAt: Date.now(),
                                content: req.body.answer
                            }
                        ],
                        $position: 0
                    }
                }
            }
        );


        res.status(200).end();
    }
}