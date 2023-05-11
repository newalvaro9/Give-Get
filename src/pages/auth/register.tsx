import { useRef, useState } from 'react'
import { getSession, signIn } from "next-auth/react";
import type { GetServerSideProps } from 'next/types';
import { useRouter } from 'next/router';

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
            setError('Please, fill in all fields');
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
                        setError("Email address is already in use");
                    }
                    else if (error === "UsernamePicked") {
                        setError("Username is already in use");
                    } else if (error === "Invalid") {
                        setError("Enter a valid email address");
                    }
                    else {
                        console.log(error)
                        setError("Server error, try again later")
                    }
                })
            } else {
                setError("Passwords do not match")
            }
        } else {
            setError("Enter a valid email address")
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
        <Layout title={"Register"}>
            <form action="/api/auth/callback/credentials" method="POST">

                <Alert error={error} setError={setError} />

                <div>
                    <label className="label" htmlFor="username">
                        Email
                    </label>
                    <input type="email" name="email" ref={emailRef} required />
                </div>

                <div>
                    <label className="label" htmlFor="username">
                        Username
                    </label>
                    <input type="text" name="username" ref={usernameRef} required />
                </div>

                <div>
                    <label className="label" htmlFor="password">
                        Password
                    </label>
                    <input type="password" name="password" ref={passwordRef} required />
                </div>

                <div>
                    <label className="label" htmlFor="username">
                        Confirm password
                    </label>
                    <input type="password" name="confirm_password" ref={confirm_passwordRef} required />
                </div>

                <button id="register" type="button" onClick={handleSignIn}>Register</button>

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