import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { GetServerSidePropsContext } from "next";
import { useRef, useState } from "react";

import styles from "@/styles/Card.module.css";

import Layout from "@/components/layout";
import Alert from "@/components/alert";

export default function Upload() {
    const [error, setError] = useState<string>("")

    const categoryRef = useRef<HTMLSelectElement>(null)
    const questionRef = useRef<HTMLTextAreaElement>(null)

    const router = useRouter();

    const handleAdd = async () => {
        const category = categoryRef!.current!.value;
        const question = questionRef!.current!.value;

        if (!category || !question) {
            setError('Porfavor, completa todos los campos');
            return;
        }

        const data = {
            category: category,
            question: question
        }

        fetch('/api/create', {
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

    };

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
        <Layout>
            <h2 className={styles['title']}>Necesito Ayuda</h2>

            <Alert error={error} setError={setError} />
            <form action="/api/create" method="POST">
                <div className={styles["forms"]}>

                    <div className={styles["form-group"]}>
                        <label className="label" htmlFor="username">
                            Categoria
                        </label>
                        <select name="username" id="category" ref={categoryRef}>
                            <option value="Matemàtiques">Matemàtiques</option>
                            <option value="Ciències Naturals">Ciències Naturals</option>
                            <option value="Llengua i Literatura">Llengua i Literatura</option>
                            <option value="Història">Història</option>
                            <option value="Geografia">Geografia</option>
                            <option value="Educació Física">Educació Física</option>
                            <option value="Tecnologia">Tecnologia</option>
                            <option value="Informàtica">Informàtica</option>
                            <option value="Anglès">Idiomes Estrangers (Anglès)</option>
                            <option value="Francès">Idiomes Estrangers (Francès)</option>
                            <option value="Alemany">Idiomes Estrangers (Alemany)</option>
                            <option value="Religió">Religió</option>
                        </select>

                    </div>

                    <div className={styles["form-group"]}>
                        <label className="label" htmlFor="password">
                            En que necesitas ayuda?
                        </label>
                        <textarea name="question" id="myTextArea" ref={questionRef} onInput={autoResize}></textarea>
                    </div>
                </div>

                <button id="new" type="button" onClick={handleAdd}>Pedir ayuda</button>

            </form>

        </Layout >
    );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/auth/login",
                permanent: false,
            },
        };
    }

    return {
        props: { session },
    };
}