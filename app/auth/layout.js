const AuthLayout = ({ children }) => {
    return (
        <div className="h-full flex items-center justify-center relative">
            <video autoPlay loop muted className="absolute inset-0 w-full h-full object-cover z-0">
                <source src="/deploy-background.mp4" type="video/mp4" />
            </video>
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export default AuthLayout;
