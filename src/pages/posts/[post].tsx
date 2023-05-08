import Layout from '@/components/layout';
import styles from '@/styles/Card.module.css';
import { GetServerSideProps } from 'next';
import posts from '../../../lib/database/models/posts';
import connect from '../../../lib/database/database';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Delete({ session, postid }: any) {
    const router = useRouter();

    return (
        <Layout title={"View Post - Give Your Time"}>
            
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {

    await connect();

    const post = await posts.findOne({ postid: context?.params?.post });
    if (!post) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        }
    }
    const session = await getSession(context);

    if (post.postedBy.userid !== (session?.user as any).userid) {
        return {
            redirect: {
                destination: "/404",
                permanent: false,
            },
        }
    }

    return {
        props: {
            session: session,
            postid: post.postid
        }
    }
}