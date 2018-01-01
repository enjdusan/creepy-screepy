const spawn = Game.spawns['Spawn1'];

let roles = {
    HARVESTER: {

        name: 'harvester',
        harvesting: false,

        // Pokud ma creepa 0 energie, tak jde tezit, jinak odnese do Spawnu
        run: function(creep) {
            // FIXME: DRY
            if (creep.carry.energy === 0) {
                creep.memory.harvesting = true;
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.harvesting = false;
            }

            if (creep.memory.harvesting) {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            } else {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
                }
            }
        }
    },

    UPGRADER: {

        name: 'upgrader',
        upgrading: false,

        // Pokud ma Upgrader 0 energie, tak jde tezit, pokud ma plno, tak jde upgradovat controller
        run: function(creep) {
            // FIXME: DRY
            if (creep.carry.energy === 0) {
                creep.memory.upgrading = false
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.upgrading = true
            }

            if (creep.memory.upgrading) {
                // creep.build(creep.room.constructionSite)

                if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            } else {
                let source = creep.pos.findClosestByPath(FIND_SOURCES);
                if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    },

    REPAIRER: {

        name: 'repairer',
        working: false,

        run(creep) {
            // FIXME: DRY
            if (creep.carry.energy === 0) {
                creep.memory.working = false;
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.working = true;
            }

            // Najde nejblizsi stavbu, ktera nema plne hitpointy a tu se snazi opravit
            if (creep.memory.working) {
                let needsRepair = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter(structure) {
                        return structure.hits < structure.hitsMax;
                    }
                });

                // Kdyz neni co opravovat, tak jede stavet
                if (needsRepair) {
                    creep.memory.building = false;

                    if (creep.repair(needsRepair) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(needsRepair);
                    }
                } else {
                    creep.memory.building = true;
                }
            } else {
                roles.findAndHarvestEnergy(creep);
            }
        }

    },

    findAndHarvestEnergy(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
    },

    // Staveni silnice po ceste
    buildRoad(creep) {
        let result = creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
    }
};

module.exports = roles;
