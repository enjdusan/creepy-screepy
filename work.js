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
                        let fill = this.fillExtension(creep);
                        if (!fill) {
                            this.construct(creep);
                        }
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
                            let percentage = 1;
                            // Silnice opravovat, az se dostanou na 70 %
                            if (structure.structureType === STRUCTURE_ROAD) {
                                percentage = 0.7
                            }
                            return structure.hits < structure.hitsMax * percentage;
                        }
                    });

                    // Kdyz neni co opravovat, tak jede stavet
                    if (needsRepair) {
                        if (creep.repair(needsRepair) === ERR_NOT_IN_RANGE) {
                            creep.moveTo(needsRepair);
                        }
                    } else {
                        console.log('neni co opravovat');
                        let construct = this.construct(creep);

                        // FIXME: DRY
                        if (!construct) {
                            if (spawn.energy === spawn.energyCapacity) {
                                this.fillExtension(creep);
                                return;
                            }

                            if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                                creep.moveTo(spawn);
                            }
                        }
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
        let constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

        if (!constructionSite) {
            return false;
        }

        if (creep.build(constructionSite) === ERR_NOT_IN_RANGE) {
            creep.moveTo(constructionSite)
        }
    },

    fillExtension(creep) {
        // Najdeme vsechny extensiony, ktere nemaji plnou kapacitu
        let extension = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter(s) {
                return s.structureType === STRUCTURE_EXTENSION && s.energy < s.energyCapacity
            }
        });

        let transfer = creep.transfer(extension, RESOURCE_ENERGY);

        if (transfer === ERR_NOT_IN_RANGE) {
            creep.moveTo(extension);
            return true;
        } else if (transfer === OK) {
            return true;
        }

        return false;
    }
};

module.exports = Work;
