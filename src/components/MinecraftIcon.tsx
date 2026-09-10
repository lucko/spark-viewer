import styles from '../style/minecraft.module.css';

export interface MinecraftIconProps {
    name: string;
}

export default function MinecraftIcon({ name }: MinecraftIconProps) {
    const icon = lookup[name];
    if (icon) {
        const baseStyle = styles['icon-minecraft-sm'];
        const iconStyle = styles[`icon-minecraft-${icon}`];
        return <i className={`${baseStyle} ${iconStyle}`}></i>;
    } else {
        return <span className="icon-missing" />;
    }
}

const mobs = [
    'allay',
    'armadillo',
    'axolotl',
    'bat',
    'bee',
    'blaze',
    'bogged',
    'breeze',
    'camel',
    'camel_husk',
    'cat',
    'cave_spider',
    'chicken',
    'cod',
    'copper_golem',
    'cow',
    'creaking',
    'creeper',
    'dolphin',
    'donkey',
    'drowned',
    'elder_guardian',
    'enderman',
    'endermite',
    'ender_dragon',
    'evoker',
    'fox',
    'frog',
    'ghast',
    'happy_ghast',
    'glow_squid',
    'goat',
    'guardian',
    'hoglin',
    'horse',
    'husk',
    'iron_golem',
    'llama',
    'magma_cube',
    'mooshroom',
    'mule',
    'nautilus',
    'ocelot',
    'panda',
    'parched',
    'parrot',
    'phantom',
    'pig',
    'piglin',
    'piglin_brute',
    'pillager',
    'polar_bear',
    'pufferfish',
    'rabbit',
    'ravager',
    'salmon',
    'sheep',
    'shulker',
    'silverfish',
    'skeleton',
    'skeleton_horse',
    'slime',
    'sniffer',
    'snow_golem',
    'spider',
    'squid',
    'stray',
    'strider',
    'sulfur_cube',
    'tadpole',
    'trader_llama',
    'tropical_fish',
    'turtle',
    'vex',
    'villager',
    'vindicator',
    'wandering_trader',
    'warden',
    'witch',
    'wither',
    'wither_skeleton',
    'wolf',
    'zoglin',
    'zombie',
    'zombie_horse',
    'zombie_nautilus',
    'zombie_villager',
    'zombified_piglin',
];

const boats = [
    'acacia',
    'birch',
    'cherry',
    'dark_oak',
    'jungle',
    'mangrove',
    'oak',
    'pale_oak',
    'spruce',
];

const minecarts = ['chest', 'command_block', 'furnace', 'hopper', 'tnt'];

const lookup: Record<string, string | null> = {
    ...Object.fromEntries(
        mobs.map(type => [type, `mob-${type.replace(/_/g, '-')}-face`])
    ),
    ...Object.fromEntries(
        boats.map(type => [`${type}_boat`, `${type.replace(/_/g, '-')}-boat`])
    ),
    ...Object.fromEntries(
        boats.map(type => [
            `${type}_chest_boat`,
            `${type.replace(/_/g, '-')}-chest-boat`,
        ])
    ),
    ...Object.fromEntries(
        minecarts.map(type => [
            `${type}_minecart`,
            `${type.replace(/_/g, '-')}-minecart`,
        ])
    ),

    area_effect_cloud: 'splash-potion',
    armor_stand: 'armor-stand',
    arrow: 'arrow',
    bamboo_chest_raft: 'bamboo-chest-raft',
    bamboo_raft: 'bamboo-raft',
    block_display: null,
    breeze_wind_charge: 'wind-charge',
    dragon_fireball: 'fire-charge',
    egg: 'egg',
    ender_pearl: 'ender-pearl',
    end_crystal: 'end-crystal',
    evoker_fangs: null,
    experience_bottle: 'experience-bottle',
    experience_orb: 'experience-bottle',
    eye_of_ender: 'ender-eye',
    falling_block: 'sand',
    fireball: 'fire-charge',
    firework_rocket: 'firework-rocket',
    giant: 'mob-zombie-face',
    glow_item_frame: 'glow-item-frame',
    illusioner: null,
    interaction: null,
    item: 'iron-ingot',
    item_display: null,
    item_frame: 'item-frame',
    leash_knot: 'lead',
    lightning_bolt: null,
    llama_spit: null,
    mannequin: null,
    marker: null,
    minecart: 'minecart',
    ominous_item_spawner: 'ominous-trial-key',
    painting: 'painting',
    splash_potion: 'splash-potion',
    lingering_potion: 'lingering-potion',
    shulker_bullet: 'shulker-shell',
    small_fireball: 'fire-charge',
    snowball: 'snowball',
    spawner_minecart: 'minecart',
    spectral_arrow: 'spectral-arrow',
    text_display: null,
    tnt: 'tnt',
    trident: 'trident',
    wind_charge: 'wind-charge',
    wither_skull: 'wither-skeleton-skull',
    player: 'player-head',
    fishing_bobber: 'fishing-rod',

    // removed in current game version but existed previously
    potion: 'potion',
    boat: 'oak-boat',
    chest_boat: 'oak-chest-boat',
};
