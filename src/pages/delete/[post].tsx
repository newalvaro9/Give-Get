import Layout from '@/components/layout';
import styles from '@/styles/Card.module.css';
import { GetServerSideProps } from 'next';
import posts from '../../../lib/database/models/posts';
import connect from '../../../lib/database/database';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function Delete({ session, postid }: any) {
    const router = useRouter();
    
    const handleDelete = () => {
        const data = {
            postid: postid
        }
        fetch('/api/posts/delete', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => router.push('/'))
            .catch(error => {
                alert("Internal server error")
            });
    }

    return (
        <Layout title={"Eliminar pregunta - Give Your Time"}>
            <form action="/api/posts/delete" method="POST">
                <div className={styles["card"]}>
                    <div className={styles["card-body"]}>
                        <h2 className={styles['title']}>Segur que vols eliminar el post número {postid}?</h2>
                        <button id="login" type="button" onClick={handleDelete} className={styles["submit-input"]}>Eliminar</button>
                    </div>
                </div>
            </form>
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