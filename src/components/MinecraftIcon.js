import React from 'react';

import '../style/minecraft.css';

export default function MinecraftIcon({ name }) {
    const lookup = {
        item: 'iron-ingot',
        experience_orb: 'experience-bottle',
        area_effect_cloud: 'splash-potion',
        elder_guardian: 'spawn-egg-elder-guardian',
        wither_skeleton: 'spawn-egg-wither-skeleton',
        stray: 'spawn-egg-stray',
        egg: 'egg',
        leash_knot: 'lead',
        painting: 'painting',
        arrow: 'arrow',
        snowball: 'snowball',
        fireball: 'fire-charge',
        small_fireball: 'fire-charge',
        ender_pearl: 'ender-pearl',
        eye_of_ender: 'ender-eye',
        potion: 'potion',
        experience_bottle: 'experience-bottle',
        item_frame: 'item-frame',
        wither_skull: 'wither-skeleton-skull',
        tnt: 'tnt',
        falling_block: 'sand',
        firework_rocket: 'firework-rocket',
        husk: 'spawn-egg-husk',
        spectral_arrow: 'spectral-arrow',
        shulker_bullet: 'shulker-shell',
        dragon_fireball: 'fire-charge',
        zombie_villager: 'spawn-egg-zombie-villager',
        skeleton_horse: 'spawn-egg-skeleton-horse',
        zombie_horse: 'spawn-egg-zombie-horse',
        armor_stand: 'armor-stand',
        donkey: 'spawn-egg-donkey',
        mule: 'spawn-egg-donkey',
        //evoker_fangs: '',
        evoker: 'spawn-egg-evoker',
        vex: 'spawn-egg-vex',
        vindicator: 'spawn-egg-vindicator',
        //illusioner: '',
        command_block_minecart: 'command-block-minecart',
        boat: 'oak-boat',
        minecart: 'minecart',
        chest_minecart: 'chest-minecart',
        furnace_minecart: 'furnace-minecart',
        tnt_minecart: 'tnt-minecart',
        hopper_minecart: 'hopper-minecart',
        spawner_minecart: 'minecart',
        creeper: 'spawn-egg-creeper',
        skeleton: 'spawn-egg-skeleton',
        spider: 'spawn-egg-spider',
        giant: 'spawn-egg-zombie',
        zombie: 'spawn-egg-zombie',
        slime: 'spawn-egg-slime',
        ghast: 'spawn-egg-ghast',
        zombified_piglin: 'spawn-egg-zombified-piglin',
        enderman: 'spawn-egg-enderman',
        cave_spider: 'spawn-egg-cave-spider',
        silverfish: 'spawn-egg-silverfish',
        blaze: 'spawn-egg-blaze',
        magma_cube: 'spawn-egg-magma-cube',
        ender_dragon: 'mob-ender-dragon-face',
        wither: 'wither-skeleton-skull',
        bat: 'spawn-egg-bat',
        witch: 'spawn-egg-witch',
        endermite: 'spawn-egg-endermite',
        guardian: 'spawn-egg-guardian',
        shulker: 'spawn-egg-shulker',
        pig: 'spawn-egg-pig',
        sheep: 'spawn-egg-sheep',
        cow: 'spawn-egg-cow',
        chicken: 'spawn-egg-chicken',
        squid: 'spawn-egg-squid',
        wolf: 'spawn-egg-sheep',
        mooshroom: 'spawn-egg-wolf',
        snow_golem: 'mob-snow-golem-face',
        ocelot: 'spawn-egg-ocelot',
        iron_golem: 'mob-iron-golem-face',
        horse: 'spawn-egg-horse',
        rabbit: 'spawn-egg-rabbit',
        polar_bear: 'spawn-egg-polar-bear',
        llama: 'spawn-egg-llama',
        //llama_spit: '',
        parrot: 'spawn-egg-parrot',
        villager: 'spawn-egg-villager',
        end_crystal: 'end-crystal',
        turtle: 'spawn-egg-turtle',
        phantom: 'spawn-egg-phantom',
        trident: 'trident',
        cod: 'cod',
        salmon: 'salmon',
        pufferfish: 'pufferfish',
        tropical_fish: 'tropical-fish',
        drowned: 'spawn-egg-drowned',
        dolphin: 'spawn-egg-dolphin',
        cat: 'spawn-egg-cat',
        panda: 'spawn-egg-panda',
        pillager: 'spawn-egg-pillager',
        ravager: 'spawn-egg-ravager',
        trader_llama: 'spawn-egg-trader-llama',
        wandering_trader: 'spawn-egg-wandering-trader',
        fox: 'spawn-egg-fox',
        bee: 'spawn-egg-bee',
        hoglin: 'spawn-egg-hoglin',
        piglin: 'spawn-egg-piglin',
        strider: 'spawn-egg-piglin-brute',
        zoglin: 'spawn-egg-zoglin',
        piglin_brute: 'spawn-egg-piglin-brute',
        fishing_bobber: 'fishing-rod',
        //lightning_bolt: '',
        player: 'player-head',
        axolotl: 'spawn-egg-axolotl',
        glow_item_frame: 'glow-item-frame',
        glow_squid: 'spawn-egg-glow-squid',
        goat: 'spawn-egg-goat',
        marker: '',
        allay: 'spawn-egg-allay',
        chest_boat: 'oak-chest-boat',
        frog: 'spawn-egg-frog',
        tadpole: 'spawn-egg-tadpole',
        warden: 'spawn-egg-warden',
    };

    const icon = lookup[name];
    if (icon) {
        return <i className={`icon-minecraft-sm icon-minecraft-${icon}`}></i>;
    } else {
        return null;
    }
}
