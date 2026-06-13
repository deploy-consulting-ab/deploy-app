const AuthLayout = ({ children }) => {
    return (
        <div className="h-full flex items-center justify-center relative">
            {/* Mobile: static poster image */}
            <div
                className="absolute inset-0 w-full h-full bg-cover bg-center z-0 md:hidden"
                style={{ backgroundImage: 'url(/images/deploy-background-poster.jpg)' }}
            />

            {/* Desktop: video background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/images/deploy-background-poster.jpg"
                className="absolute inset-0 w-full h-full object-cover z-0 hidden md:block"
            >
                <source src="/deploy-background.mp4" type="video/mp4" />
                <source src="/deploy-background.webm" type="video/webm" />
            </video>

            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default AuthLayout;
