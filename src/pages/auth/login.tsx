import { useRef, useState } from 'react'
import { getSession, signIn } from "next-auth/react";
import { useRouter } from 'next/router';
import type { GetServerSideProps } from 'next/types';

import styles from '@/styles/Card.module.css'

import Layout from '@/components/layout';
import Alert from '@/components/alert';

export default function Login() {

    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [error, setError] = useState<string>("")

    const router = useRouter();

    const handleSignIn = () => {

        const username = usernameRef!.current!.value.trim();
        const password = passwordRef!.current!.value;

        if (!username || !password) {
            setError('Si us plau, ompliu tots els camps');
            return;
        }

        signIn('credentials', {
            redirect: false,
            username: username,
            password: password,
            type: "login",
        }).then(({ error }: any) => {
            if (!error || error.length === 0) {
                router.push('/');
            }
            else if (error === "CredencialesIncorrectas") {
                setError("Nom d'usuari o contrasenya incorrecte");
            }
            else {
                setError("Server error, try again later");
            }
        })
    }

    if (typeof window !== 'undefined') {
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                document.getElementById("login")?.click();
            }
        });
    }

    return (
        <Layout title={"Iniciar sessió - Give & Time"}>
            <form action="/api/auth/callback/credentials" method="POST">
                <div className={styles["card"]}>
                    <div className={styles["card-body"]}>
                        <h2 className={styles['title']}>Inicia sessió per continuar</h2>

                        <Alert error={error} setError={setError} />

                        <div className={styles["forms"]}>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Usuari
                                </label>
                                <input type="text" id="username" name="username" ref={usernameRef} required />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="password">
                                    Contrasenya
                                </label>
                                <input type="password" name="password" ref={passwordRef} required />
                            </div>
                        </div>

                        <button id="login" type="button" onClick={handleSignIn} className={styles["submit-input"]}>Iniciar sessió</button>
                    </div>
                </div>
            </form>
        </Layout>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session) {
        return {
            redirect: {
                destination: "/profile",
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}