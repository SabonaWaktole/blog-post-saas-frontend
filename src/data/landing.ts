export interface LandingFeature {
    icon: string
    title: string
    description: string
    className?: string
    isLarge?: boolean
    isWide?: boolean
    image?: string
}

export interface LandingStep {
    number: number
    title: string
    description: string
    icon: string
    order: {
        text: 'md:order-1' | 'md:order-2' | 'md:order-3'
        image: 'md:order-1' | 'md:order-2' | 'md:order-3'
        number: 'md:order-1' | 'md:order-2' | 'md:order-3'
    }
}

export const landingFeatures: LandingFeature[] = [
    {
        icon: 'edit_note',
        title: 'Distraction-free Editor',
        description: 'Our editor is a sanctuary for your thoughts. No pop-ups, no complex sidebars. Just your words and the whitespace they deserve. Includes advanced typography control and offline sync.',
        isLarge: true,
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuClbZyePHnM8g0WZsYhUX072JHA_-ILvC6SCZrP_aK5V2ME1ObTs7eknZ7q2p8qBBu_BJv-uvBva3DD0lQfAbiCUIDx0JDcn4lFYM82fu7PfM87pgmeMiFtQLcO_6o448TiX0UH5PCyYHR1IvE9XSLeDOyOf_yOVInvYaQnhB4HysrHqKrZLDrSFpSgmNwF5juRVk4B7km61hPNz8AXWpOZ9RwsNk5fYHnH817vqwwo4nsdGP6Eu2P-ZfQY1ONXgxlpeXzkP3rpNow"
    },
    {
        icon: 'hub',
        title: 'Multi-tenant Management',
        description: 'Toggle between different publications, sub-brands, or clients instantly. Centralized media assets and user permissions.',
        isLarge: false
    },
    {
        icon: 'account_tree',
        title: 'Editorial Workflows',
        description: 'Built-in approval cycles, version history, and real-time collaboration tools designed for professional newsrooms.',
        isLarge: false
    },
    {
        icon: 'insights',
        title: 'Reader Insights',
        description: 'Understand how your audience engages with your long-form content. Depth of reading metrics, heatmaps, and focus-time tracking.',
        isWide: true
    }
]

export const landingSteps: LandingStep[] = [
    {
        number: 1,
        title: 'Create Your Space',
        description: 'Configure your publications with custom branding, domains, and editorial guidelines in minutes.',
        icon: 'settings',
        order: { text: 'md:order-1', number: 'md:order-2', image: 'md:order-3' }
    },
    {
        number: 2,
        title: 'Invite Your Team',
        description: 'Assign roles—Editors, Authors, Photographers—and build a collaborative environment that flows naturally.',
        icon: 'group_add',
        order: { text: 'md:order-3', number: 'md:order-2', image: 'md:order-1' }
    },
    {
        number: 3,
        title: 'Publish with Elegance',
        description: 'Hit publish and watch your content render perfectly across all devices with our industry-leading rendering engine.',
        icon: 'rocket_launch',
        order: { text: 'md:order-1', number: 'md:order-2', image: 'md:order-3' }
    }
]
