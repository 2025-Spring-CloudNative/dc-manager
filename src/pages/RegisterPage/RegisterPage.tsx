import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import styles from "./RegisterPage.module.scss"

import { UserWithPassword } from "@/features/user/types"
import { useRegisterMutation } from "@features/user/hooks/useUser"

export default function RegisterPage() {
    const registerMutation = useRegisterMutation()
    const navigate = useNavigate()
    const location = useLocation()
    const [form, setForm] = useState<UserWithPassword>({
        name: "",
        email: "",
        passwordHash: "",
        role: "user",
    })

    const { isError, error } = registerMutation
    const from = location.state?.from?.pathname || "/"

    const handleChange = (e: any) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = (e: any) => {
        e.preventDefault()
        registerMutation.mutate(form, {
            onSuccess: () => navigate(from, { replace: true }),
        })
    }

    return (
        <div className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <h1 className={styles.title}>註冊帳號</h1>

                <div className={styles.field}>
                    <label htmlFor="name">姓名</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="passwordHash">密碼</label>
                    <input
                        id="passwordHash"
                        name="passwordHash"
                        type="password"
                        value={form.passwordHash}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={styles.button}
                    disabled={
                        !form.name ||
                        !form.email ||
                        !form.passwordHash ||
                        !form.role ||
                        registerMutation.isPending
                    }
                >
                    註冊
                </button>

                {/* simple inline error; swap for toast/snackbar if you prefer */}
                {isError && (
                    <p className={styles.error}>
                        {/* backend should send { message } — fall back if not */}
                        {error instanceof Error ? error.message : "Register failed"}
                    </p>
                )}
            </form>
        </div>
    )
}
