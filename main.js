const ROLES = require('roles');
const autobuild = require('autobuild');

const mainSpawn = Game.spawns['Spawn1'];
const creeps = Game.creeps;

let
    harvesters = 0,
    upgraders = 0,
    repairers = 0,
    maxHarvesters = 3,
    maxUpgraders = 3,
    maxRepairers = 2;

for (let name in creeps) {
    if (creeps[name].memory.name === 'harvester') {
        harvesters++;
        ROLES.HARVESTER.run(creeps[name]);
        // ROLES.buildRoad(creeps[name]);
    }

    if (creeps[name].memory.name === 'upgrader') {
        upgraders++;
        ROLES.UPGRADER.run(creeps[name]);
        // ROLES.buildRoad(creeps[name]);
    }

    if (creeps[name].memory.name === 'repairer') {
        repairers++;
        ROLES.REPAIRER.run(creeps[name]);
    }
}

console.log(`Pocty: harvesters ${harvesters}; upgraders ${upgraders}; repairers ${repairers}.`);

// Stavet jen kdyz je dostatek naspawnovanych harvesteru
if (harvesters >= maxHarvesters && upgraders >= maxUpgraders) {
    autobuild();
}

if (mainSpawn.energy >= 200 && harvesters < maxHarvesters) {
    let spawn = {
        name: 'Harvester',
        role: ROLES.HARVESTER,
        type: harvesters
    };

    spawnWorkingCreep(spawn);
}

if (mainSpawn.energy >= 200 && upgraders < maxUpgraders) {
    let spawn = {
        name: 'Upgrader',
        role: ROLES.UPGRADER,
        type: upgraders
    };

    spawnWorkingCreep(spawn);
}

if (mainSpawn.energy >= 200 && repairers < maxRepairers) {
    let spawn = {
        name: 'Repairer',
        role: ROLES.REPAIRER,
        type: repairers
    };

    spawnWorkingCreep(spawn);
}

function spawnWorkingCreep(spawn) {
    let creepName = spawn.name + '_' + (spawn.type + 1);
    console.log(`Snazim se spawnout ${creepName}`);

    let result = mainSpawn.spawnCreep(
        [WORK, CARRY, MOVE],
        creepName,
        {memory: spawn.role});
}
