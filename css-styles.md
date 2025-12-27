On my CSS file I have this:

.gradient-accent {
background: linear-gradient(135deg,
oklch(0.95 0.03 265) 0%,
oklch(0.98 0.02 240) 100%
);
}

.dark .gradient-accent {
background: linear-gradient(135deg,
oklch(0.18 0.05 265) 0%,
oklch(0.15 0.04 240) 100%
);
}

Through Shadcn UI dark mode system, the dark mode adds a .dark to the classes, so the inner classes will
inherit the .dark and the only thing needed is adding .gradient-accent

I can add a new style by adding it to the root and theme inline

:root {
--green-custom: green
}

@theme inline {
--color-green-custom: var(--green-custom);
}

And in the file
bg-green-custom, text-green-custom, etc
