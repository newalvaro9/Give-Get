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

export default function Delete({ session, post, answers }: any) {
    const router = useRouter();
    const [writing, setWriting] = useState(false)
    const answerRef = useRef<HTMLTextAreaElement>(null)

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
        <Layout title={"View Post - Give Your Time"}>
            <div className={styles['view']}>
                <div className={styles['wrapper']}>
                    <div className={styles['q-card']}>
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
                            {writing || (
                                <button onClick={() => setWriting(true)}>Responder</button>
                            )}
                        </div>
                    </div>
                    {/* <div className={styles['answer']}>
                    {writing && (
                        <>
                            <textarea name="answer" id="myTextArea" ref={answerRef} onInput={autoResize}></textarea>
                            <button>&nbsp;{'>'}&nbsp;</button>
                        </>
                    )}
                </div> */}
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
            </div>
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

    return {
        props: {
            session: session,
            post: data,
            answers: post.answers || [{
                postedBy: {
                    userid: 2,
                    name: "Pepito"
                },
                postedAt: formatDate(Date.now()),
                content: "Ut et magna at felis commodo dignissim ac non turpis. Morbi tincidunt nec nulla sed condimentum. Praesent auctor eget urna sit amet commodo. Duis interdum elit dapibus nunc consectetur, a porttitor lorem luctus. In luctus interdum ex sed porttitor. Ut vitae ornare ante, eu euismod sapien. Proin sed lorem enim."
            },
            {
                postedBy: {
                    userid: 2,
                    name: "Pepito"
                },
                postedAt: formatDate(Date.now()),
                content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse rutrum, nisl at interdum accumsan, turpis sem maximus mauris, sed porta ipsum eros sed nisl. Etiam fringilla pharetra nulla, at bibendum velit suscipit non. Vestibulum quis sodales ante, vitae pretium libero. Proin porta nunc sed felis tempor mollis. Ut elit nibh, ultrices et ex nec, congue pulvinar lacus. Suspendisse eleifend nisl ut semper ultrices. Ut non lacus neque. Fusce tempus augue a ligula lobortis ultricies. Phasellus finibus est at accumsan fermentum. Maecenas molestie, neque a rutrum aliquam, tortor ipsum porttitor erat, quis congue nisl justo ac libero. Aenean tincidunt mauris nec eros feugiat bibendum. Morbi eu nulla ac leo euismod posuere quis ac enim. Aliquam id diam est. Quisque id erat risus. Proin eget nisl sed justo posuere convallis. Phasellus varius porttitor felis id lacinia."
            }]
        }
    }
}