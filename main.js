const ROLES = require('roles');
const autobuild = require('autobuild');

const mainSpawn = Game.spawns['Spawn1'];
const creeps = Game.creeps;

let harvesters = 0;
let upgraders = 0;

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
}

console.log(`Pocty: harvesters ${harvesters}; upgraders ${upgraders}.`);

// Stavet jen kdyz je dostatek naspawnovanych harvesteru
if (harvesters >= 6 && upgraders >= 2) {
    autobuild();
}

if (mainSpawn.energy >= 200 && harvesters < 10) {
    let spawn = {
        name: 'Harvester',
        role: ROLES.HARVESTER,
        type: harvesters
    };

    if ((upgraders + 3) < harvesters) {
        spawn = {
            name: 'Upgrader',
            role: ROLES.UPGRADER,
            type: upgraders
        }
    }

    let creepName = spawn.name + '_' + (spawn.type + 1);

    if (spawnWorkingCreep(creepName, spawn) === ERR_NAME_EXISTS) {
        spawnWorkingCreep(
            spawn.name + '_' + (spawn.type + 1) + '_' + Math.floor(Math.random() * (9999 - 1000)) + 1000,
            spawn);
    }
}

function spawnWorkingCreep(creepName, spawn) {
    console.log(`Snazim se spawnout ${creepName}`);

    return mainSpawn.spawnCreep(
        [WORK, CARRY, MOVE],
        creepName,
        {memory: spawn.role});
}
