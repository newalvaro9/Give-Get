import { useRef, useState } from 'react'
import { getSession, signIn } from "next-auth/react";
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';
import styles from '@/styles/Card.module.css'
import Layout from '@/components/layout';
import Alert from '@/components/alert';

import validateEmail from '../../../utils/validateEmail';

export default function Register() {

    const emailRef = useRef<HTMLInputElement>(null)
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirm_passwordRef = useRef<HTMLInputElement>(null)

    const [error, setError] = useState<string>("")

    const router = useRouter();

    const handleSignIn = () => {

        const email = emailRef!.current!.value.trim();
        const username = usernameRef!.current!.value.trim();
        const password = passwordRef!.current!.value;
        const confirm_password = confirm_passwordRef!.current!.value;

        if (!email || !username || !password || !confirm_password) {
            setError('Si us plau, ompliu tots els camps');
            return;
        }

        if (validateEmail(email)) {
            if (password === confirm_password) {
                signIn('credentials', {
                    redirect: false,
                    email: email,
                    username: username,
                    password: password,
                    type: "register",
                }).then(({ error }: any) => {
                    if (!error || error.length === 0) {
                        router.push('/');
                    }
                    else if (error === "EmailPicked") {
                        setError("El correu electrònic ja està en us");
                    }
                    else if (error === "UsernamePicked") {
                        setError("El nom d'usuari ja està en us");
                    } else if (error === "Invalid") {
                        setError("Introdueix un correu electrònic vàlid");
                    }
                    else {
                        console.log(error)
                        setError("Server error, try again later")
                    }
                })
            } else {
                setError("Les contrasenyes no coincideixen")
            }
        } else {
            setError("Introdueix un correu electrònic vàlid")
        }
    }

    if (typeof window !== 'undefined') {
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                document.getElementById("register")?.click();
            }
        });
    }

    return (
        <Layout title={"Registrar-me - Give & Get"}>
            <form action="/api/auth/callback/credentials" method="POST">
                <div className={styles["card"]}>
                    <div className={styles["card-body"]}>
                        <h2 className={styles['title']}>Registre d'usuari</h2>

                        <Alert error={error} setError={setError} />

                        <div className={styles["forms"]}>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Correu electrònic
                                </label>
                                <input type="email" name="email" ref={emailRef} required />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Nom d'usuari
                                </label>
                                <input type="text" name="username" ref={usernameRef} required />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="password">
                                    Contrasenya
                                </label>
                                <input type="password" name="password" ref={passwordRef} required />
                            </div>

                            <div className={styles["form-group"]}>
                                <label className="label" htmlFor="username">
                                    Confirmar contrasenya
                                </label>
                                <input type="password" name="confirm_password" ref={confirm_passwordRef} required />
                            </div>
                        </div>

                        <button id="login" type="button" onClick={handleSignIn} className={styles["submit-input"]}>Registar-me</button>
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