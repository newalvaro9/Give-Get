import Layout from '@/components/layout';
import styles from '@/styles/Posts.module.css';
import { GetServerSideProps } from 'next';
import posts from '../../../lib/database/models/posts';
import connect from '../../../lib/database/database';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import formatDate from '../../../utils/formatDate';
import Image from 'next/image';
import { useState, useRef } from 'react';

export default function Delete({ post, answers, sessionX }: any) {
    const router = useRouter();
    const [writing, setWriting] = useState(false)
    const answerRef = useRef<HTMLTextAreaElement>(null)

    const handleLogin = () => {
        router.push('/auth/login');
    }

    const handleSubmit = () => {
        const answer = answerRef.current?.value;
        if (!answer) return;

        const data = {
            postid: post.postid,
            answer: answer
        }

        fetch('/api/answers/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => router.reload())
            .catch(error => {
                alert("Internal server error")
            });

    }

    if (typeof window !== 'undefined') {
        document.addEventListener('keydown', function (event) {
            // Check if the event target is a textarea
            const isTextareaSelected = (event.target as HTMLElement).tagName.toLowerCase() === 'textarea';

            // Proceed only if Enter key is pressed and a textarea is not selected
            if (event.key === 'Enter' && !isTextareaSelected) {
                document.getElementById("new")?.click();
            }
        });
    }

    function autoResize() {
        const textArea = document.getElementById('myTextArea');
        textArea!.style.height = 'auto';
        textArea!.style.height = textArea!.scrollHeight + 'px';
    }


    return (
        <Layout title={`${post.question.slice(0, 40) + (post.question.length > 40 ? "..." : "")} - Give & Get`}>
            <div className={styles['view']}>
                <form action='/api/answers/create' method='POST'>

                    <div className={styles['wrapper']}>
                        <div className={styles['card']}>
                            <div className={styles['card-header']}>
                                <Image
                                    src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'}
                                    alt='avatar'
                                    width={40}
                                    height={40}
                                ></Image>
                                <div className={styles['header-info']}>
                                    <h4>{post.postedBy.name}</h4>
                                    <p>{post.postedAt} · {post.category}</p>
                                </div>
                            </div>
                            <div className={styles['card-body']}>
                                <pre>{post.question}</pre>
                            </div>
                            <div className={styles['helper']}>
                                {sessionX ? (
                                    <button type="button" onClick={() => setWriting(true)}>Respondre</button>
                                ) : (
                                    <button type="button" onClick={handleLogin}>Inicia sessió per respondre</button>
                                )}
                            </div>
                        </div>
                        {writing && (
                            <div className={styles['answer']}>
                                <textarea name="answer" id="myTextArea" ref={answerRef} onInput={autoResize}></textarea>
                                <button type='button' onClick={handleSubmit}>&nbsp;{'>'}&nbsp;</button>
                            </div>
                        )}
                        <div className={styles['answers']}>
                            {answers.map((answer: any) => (
                                <div className={styles['answer-card']}>
                                    <div className={styles['card-header']}>
                                        <Image
                                            src={'https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg'}
                                            alt='avatar'
                                            width={40}
                                            height={40}
                                        ></Image>
                                        <div className={styles['header-info']}>
                                            <h4>{answer.postedBy.name}</h4>
                                            <p>{answer.postedAt}</p>
                                        </div>
                                    </div>
                                    <div className={styles['card-body']}>
                                        <pre>{answer.content}</pre>
                                    </div>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </form>
            </div >
        </Layout >
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
    const data = {
        postid: post.postid,
        postedBy: {
            userid: post.postedBy.userid,
            name: post.postedBy.name
        },
        postedAt: formatDate(post.postedAt),
        category: post.category,
        question: post.question,
    };

    const ansData = post.answers.map((p: any) => {
        return {
            postedBy: {
                userid: p.postedBy.userid,
                name: p.postedBy.name
            },
            postedAt: formatDate(p.postedAt),
            content: p.content
        }
    })

    const session = await getSession(context);

    return {
        props: {
            post: data,
            answers: ansData,
            sessionX: session
        }
    }
}