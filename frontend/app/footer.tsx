"use client"
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="absolute inset-x-0 bottom-0 h-16">
            <p className="text-center text-xs text-gray-500">
                By signing in, you agree to our{' '}
                <Link href="/terms" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    Terms of Service{' '}
                </Link>
                and{' '}
                <Link href="/privacy" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    Privacy Policy
                </Link>
            </p>
            <div className="text-center text-xs text-gray-500">
                &copy; <b>2025 Listable</b>
            </div>
        </footer>
    );
}