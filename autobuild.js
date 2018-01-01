module.exports = () => {
    const roadConstructions = Game.spawns['Spawn1'].room.find(FIND_CONSTRUCTION_SITES, {
        filter(structure) {
            return structure.structureType === STRUCTURE_ROAD;
        }
    });

    for (let name in Game.constructionSites) {
        let constructionSite = Game.constructionSites[name];

        if (constructionSite.progress < constructionSite.progressTotal) {

            // Prioritne stavet cesty pred ostatnimi
            if (
                (roadConstructions.length > 0 && constructionSite.structureType === STRUCTURE_ROAD)
                || roadConstructions.length === 0
            ) {
                for (let creepName in Game.creeps) {
                    let creep = Game.creeps[creepName];
                    if (
                        (!creep.hasOwnProperty('building') ||
                            !creep['building']) &&
                        creep.carry.energy === creep.carryCapacity &&
                        Game.spawns['Spawn1'].energy >= 200
                    ) {
                        creep.memory.building = true;
                        creep.memory.harvesting = false;
                    } else if (creep.carry.energy === 0) {
                        creep.memory.building = false;
                        creep.memory.harvesting = true;
                    }

                    if (creep.memory.building) {
                        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(constructionSite);
                        } else if (creep.build(constructionSite) === ERR_NOT_ENOUGH_ENERGY) {
                            creep.memory.building = false;
                            creep.memory.harvesting = true;
                        }
                    }
                }
            }
        }
    }
};
