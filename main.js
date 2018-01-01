const Work = require('work');

const mainSpawn = Game.spawns['Spawn1'];
const creeps = Game.creeps;

let
    harvesters = 0,
    upgraders = 0,
    repairers = 0,
    maxHarvesters = 4,
    maxUpgraders = 3,
    maxRepairers = 3;

for (let name in creeps) {
    if (creeps[name].memory.name === 'harvester') {
        harvesters++;
        // ROLES.buildRoad(creeps[name]);
    }

    if (creeps[name].memory.name === 'upgrader') {
        upgraders++;
        // ROLES.buildRoad(creeps[name]);
    }

    if (creeps[name].memory.name === 'repairer') {
        repairers++;
    }

    Work.run(creeps[name]);
}

console.log(`Pocty: harvesters ${harvesters}; upgraders ${upgraders}; repairers ${repairers}.`);

if (mainSpawn.energy >= 200) {
    let creepInfo = null;

    if (harvesters < maxHarvesters) {
        creepInfo = {
            name: 'harvester',
            type: harvesters
        };
    } else if (upgraders < maxUpgraders) {
        creepInfo = {
            name: 'upgrader',
            type: upgraders
        };
    } else if (repairers < maxRepairers) {
        creepInfo = {
            name: 'repairer',
            type: repairers
        };
    }

    if (creepInfo) {
        spawnWorkingCreep(creepInfo);
    }
}

function spawnWorkingCreep(creepInfo, name) {
    let creepName = name || creepInfo.name + '_' + (creepInfo.type + 1);
    console.log(`Snazim se spawnout ${creepName}`);

    let result = mainSpawn.spawnCreep(
        [WORK, CARRY, MOVE],
        creepName,
        {memory: {name: creepInfo.name, working: false}});

    if (result === ERR_NAME_EXISTS) {
        spawnWorkingCreep(creepInfo, creepName + 1);
    }
}
