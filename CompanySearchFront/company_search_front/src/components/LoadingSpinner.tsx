interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
}

export function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
    return (
        <div className={`loading-spinner loading-spinner--${size}`}>
            <div className="loading-spinner__circle"></div>
            {text && <p className="loading-spinner__text">{text}</p>}
        </div>
    );
}