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

let creepInfo = null;

if (harvesters < maxHarvesters) {
    creepInfo = {
        name: 'harvester',
        type: harvesters
    };
}
if (upgraders < maxUpgraders) {
    creepInfo = {
        name: 'upgrader',
        type: upgraders
    };
}
if (repairers < maxRepairers) {
    creepInfo = {
        name: 'repairer',
        type: repairers
    };
}

if (creepInfo) {
    spawnWorkingCreep(creepInfo);
}

function spawnWorkingCreep(creepInfo, name) {
    let creepName = name || creepInfo.name + '_' + (creepInfo.type + 1);
    console.log(`Snazim se spawnout ${creepName}`);

    let bodyParts = {
        harvester: [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], // 100, 100, 50, 50, 50, 50, 50 - 450
        upgrader: [WORK, WORK, CARRY, MOVE], // 100, 100, 50, 50 - 300
        repairer: [WORK, WORK, CARRY, MOVE], // 100, 100, 50, 50 - 300
    };

    // Pojistka, kdyz opravdu dochazeji harvesteri, tak udelej obycejneho
    if (harvesters <= Math.floor(maxHarvesters / 2)) {
        bodyParts.harvester = [WORK, WORK, CARRY, MOVE];
    }

    let result = mainSpawn.spawnCreep(
        bodyParts[creepInfo.name],
        creepName,
        {memory: {name: creepInfo.name, working: false}});

    if (result === ERR_NAME_EXISTS) {
        spawnWorkingCreep(creepInfo, creepName + 1);
    }
}
