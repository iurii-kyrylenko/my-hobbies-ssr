import { createServerFn } from "@tanstack/react-start";
import { Graphviz } from "@hpcc-js/wasm-graphviz";

const dotBook = `
digraph SmileysPeople {
    newrank=true;
    rankdir=TB;
    node [shape=box, style=filled, fillcolor=white, fontname="Helvetica"];
    edge [fontname="Helvetica", fontsize=10];

    // THE CIRCUS (Political Pressure)
    subgraph cluster_circus {
        label = "The Circus (Management)";
        color = "#e1f5fe";
        style = filled;
        Enderby [label="Saul Enderby (Chief)", fillcolor="#81d4fa"];
        Collins [label="Sam Collins (Operations)", fillcolor="#81d4fa"];
        Lacon [label="Oliver Lacon (Cabinet Office)", fillcolor="#b3e5fc"];
    }

    // THE CATALYST
    subgraph cluster_catalyst {
        label = "The Catalyst";
        color = "#f5f5f5";
        Maria [label="Maria Ostrakova", fillcolor="#bbdefb"];
        Vladimir [label="General Vladimir", fillcolor="#bbdefb"];
    }

    // SMILEY'S NETWORK
    subgraph cluster_investigation {
        label = "Smiley's Operation";
        color = "#fff9c4";
        style = filled;
        Smiley [label="George Smiley", fillcolor="#fdd835", shape=diamond];
        Connie [label="Connie Sachs"];
        Leipzig [label="Otto Leipzig", fillcolor="#ffcc80"];
        Esterhase [label="Toby Esterhase", fillcolor="#ffe082"];
    }

    // THE TARGET (Bern/Berlin)
    subgraph cluster_target {
        label = "Moscow Centre (Karla's Secret)";
        color = "#ffebee";
        style = filled;
        Grigoriev [label="Anton Grigoriev"];
        Alexandra [label="Alexandra (Tatiana)", fillcolor="#f48fb1"];
        Karla [label="Karla", fillcolor="#e53935", fontcolor=white];
    }

    // --- EDGE DIRECTIONS ---

    // 1. Initial Catalyst
    Maria -> Vladimir [label="Reports Soviet approach"];
    Vladimir -> Lacon [label="Demands contact"];
    Lacon -> Smiley [label="Orders 'cleanup' (deniable)"];

    // 2. Political Constraint
    Enderby -> Smiley [label="Limits budget/authority"];
    Collins -> Enderby [label="Advises caution/'Cousins'"];
    Smiley -> Enderby [label="Seeks authorization for Bern"];

    // 3. Gathering Intelligence (Info -> Recipient)
    Connie -> Smiley [label="Identifies Oleg Kirov"];
    Leipzig -> Smiley [label="Provides secret proofs"];

    // 4. Executing the Trap (Initiator -> Target)
    Smiley -> Esterhase [label="Directs field operation"];
    Esterhase -> Grigoriev [label="Blackmails/Coerces"];
    Grigoriev -> Alexandra [label="Handles funds/care"];
    Grigoriev -> Smiley [label="Confesses Karla's role"];

    // 5. The End Game
    Smiley -> Karla [label="Sends ultimatum letter"];
    Karla -> Alexandra [label="Sacrifices career for"];
    Karla -> Smiley [label="Defects (Final Node)"];

    {rank=same; Maria Vladimir}
}`;

const dotMovie =`
digraph FromDuskTillDawn {
    newrank=true;
    rankdir=TB;
    node [shape=box, style=filled, fillcolor=white, fontname="Helvetica"];
    edge [fontname="Helvetica", fontsize=10];

    // ACT 1: CRIME THRILLER (The Run)
    subgraph cluster_crime {
        label = "Act 1: The Fugitives (Texas)";
        color = "#fff3e0";
        style = filled;

        Seth [label="Seth Gecko", fillcolor="#ffcc80"];
        Richie [label="Richie Gecko (Wildcard)", fillcolor="#ffb74d"];
        FullerFamily [label="The Fullers (Jacob, Kate, Scott)", fillcolor="#ffe0b2"];
        Border [label="Mexican Border", shape=doubleoctagon, fillcolor="#cfd8dc"];
    }

    // ACT 2: SUPERNATURAL HORROR (Mexico)
    subgraph cluster_horror {
        label = "Act 2: Survival (The Titty Twister)";
        color = "#ffebee";
        style = filled;

        Bar [label="Titty Twister Bar", shape=house, fillcolor="#ef9a9a"];
        Santanico [label="Santanico Pandemonium", fillcolor="#e57373"];
        SexMachine [label="Sex Machine / Frost", fillcolor="#ef9a9a"];
        Vampires [label="Vampire Horde", shape=circle, fillcolor="#b71c1c", fontcolor=white];
    }

    // --- STORYLINE FLOW ---

    // The Crime Arc
    Seth -> Richie [label="Escapes prison with"];
    Richie -> Seth [label="Jeopardizes mission"];
    FullerFamily -> Seth [label="Hostages / Transport"];

    // The Crossing
    Seth -> Border [label="Crosses in RV"];
    Border -> Bar [label="Arrival at Rendezvous"];

    // The Pivot (The Transformation)
    Bar -> Santanico [label="The Dance"];
    Santanico -> Richie [label="Kills / Turns"];
    Santanico -> Vampires [label="Reveals True Form"];

    // The Battle
    Seth -> Vampires [label="Fights (Holy Water/Stake)"];
    SexMachine -> Vampires [label="Turns mid-battle"];
    Jacob [label="Jacob Fuller"];
    Jacob -> Vampires [label="Sacrifices self"];

    // The Resolution
    Vampires -> Kate [label="Survives"];
    Vampires -> Seth [label="Survives"];
    Seth -> Mexico [label="Continues to El Rey", shape=plaintext];

    {rank=same; Seth Richie}
}`;

const cleanSvg = (svgString: string) => {
    return svgString
        .replace(/width="[\d\.]+(pt|px)"/g, "")
        .replace(/height="[\d\.]+(pt|px)"/g, "");
};

export const getGraphSvg = createServerFn({ method: "GET" })
    .inputValidator((d: { type: string, id: string }) => d)
    .handler(async ({ data }): Promise<string> => {
        const dot = data.type == "book" ? dotBook : dotMovie;
        const svg = await Graphviz.load().then(graphviz => graphviz.dot(dot));
        return cleanSvg(svg);
    });
