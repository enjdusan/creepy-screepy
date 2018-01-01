const spawn = Game.spawns['Spawn1'];

const Work = {
    run(creep) {
        if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.working = true;
        } else if (creep.carry.energy === 0) {
            creep.memory.working = false;
        }

        if (creep.memory.working) {
            switch (creep.memory.name) {

                // PRACE HARVESTERA
                case 'harvester':
                    if (spawn.energy === spawn.energyCapacity) {
                        this.construct(creep);
                        return;
                    }

                    if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(spawn);
                    }
                    break;

                // PRACE UPGRADERA
                case 'upgrader':
                    if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                    break;

                // PRACE REPAIRERA
                case 'repairer':
                    let needsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter(structure) {
                            return structure.hits < structure.hitsMax;
                        }
                    });

                    // Kdyz neni co opravovat, tak jede stavet
                    if (needsRepair) {
                        if (creep.repair(needsRepair) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(needsRepair);
                        }
                    } else {
                        this.construct(creep);
                    }

            }
        } else {
            let source = creep.pos.findClosestByPath(FIND_SOURCES);
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    },

    construct(creep) {
        creep.build(creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES));
    }
};

module.exports = Work;