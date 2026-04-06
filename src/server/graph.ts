import { createServerFn } from "@tanstack/react-start";

const svgTest = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1053pt" height="566pt" viewBox="0.00 0.00 1053.00 566.00">
<g id="graph0" class="graph" transform="scale(1 1) rotate(0) translate(4 562.4)">
<title>SmileysPeople</title>
<polygon fill="white" stroke="none" points="-4,4 -4,-562.4 1049,-562.4 1049,4 -4,4"/>
<g id="clust1" class="cluster">
<title>cluster_circus</title>
<polygon fill="#e1f5fe" stroke="#e1f5fe" points="271,-366.8 271,-550.4 647,-550.4 647,-366.8 271,-366.8"/>
<text xml:space="preserve" text-anchor="middle" x="459" y="-533.8" font-family="Times,serif" font-size="14.00">The Circus (Management)</text>
</g>
<g id="clust2" class="cluster">
<title>cluster_catalyst</title>
<polygon fill="none" stroke="#f5f5f5" points="655,-473.6 655,-550.4 1037,-550.4 1037,-473.6 655,-473.6"/>
<text xml:space="preserve" text-anchor="middle" x="846" y="-533.8" font-family="Times,serif" font-size="14.00">The Catalyst</text>
</g>
<g id="clust3" class="cluster">
<title>cluster_investigation</title>
<polygon fill="#fff9c4" stroke="#fff9c4" points="8,-176 8,-443.6 253,-443.6 253,-176 8,-176"/>
<text xml:space="preserve" text-anchor="middle" x="130.5" y="-427" font-family="Times,serif" font-size="14.00">Smiley's Operation</text>
</g>
<g id="clust4" class="cluster">
<title>cluster_target</title>
<polygon fill="#ffebee" stroke="#ffebee" points="261,-8 261,-252.8 516,-252.8 516,-8 261,-8"/>
<text xml:space="preserve" text-anchor="middle" x="388.5" y="-236.2" font-family="Times,serif" font-size="14.00">Moscow Centre (Karla's Secret)</text>
</g>
<!-- Enderby -->
<g id="node1" class="node">
<title>Enderby</title>
<polygon fill="#81d4fa" stroke="black" points="424.98,-410.8 279.02,-410.8 279.02,-374.8 424.98,-374.8 424.98,-410.8"/>
<text xml:space="preserve" text-anchor="middle" x="352" y="-388.6" font-family="Helvetica,sans-Serif" font-size="14.00">Saul Enderby (Chief)</text>
</g>
<!-- Smiley -->
<g id="node6" class="node">
<title>Smiley</title>
<polygon fill="#fdd835" stroke="black" points="139,-326.8 33.07,-308.8 139,-290.8 244.93,-308.8 139,-326.8"/>
<text xml:space="preserve" text-anchor="middle" x="139" y="-304.6" font-family="Helvetica,sans-Serif" font-size="14.00">George Smiley</text>
</g>
<!-- Enderby&#45;&gt;Smiley -->
<g id="edge4" class="edge">
<title>Enderby-&gt;Smiley</title>
<path fill="none" stroke="black" d="M309.29,-374.41C296.38,-368.96 282.23,-362.8 269.39,-356.8 258.81,-351.85 256.78,-349.3 246,-344.8 227.46,-337.07 206.57,-329.91 188.19,-324.1"/>
<polygon fill="black" stroke="black" points="189.45,-320.82 178.86,-321.2 187.38,-327.51 189.45,-320.82"/>
<text xml:space="preserve" text-anchor="middle" x="319.69" y="-347.8" font-family="Helvetica,sans-Serif" font-size="10.00">Limits budget/authority</text>
</g>
<!-- Collins -->
<g id="node2" class="node">
<title>Collins</title>
<polygon fill="#81d4fa" stroke="black" points="451.19,-517.6 278.81,-517.6 278.81,-481.6 451.19,-481.6 451.19,-517.6"/>
<text xml:space="preserve" text-anchor="middle" x="365" y="-495.4" font-family="Helvetica,sans-Serif" font-size="14.00">Sam Collins (Operations)</text>
</g>
<!-- Collins&#45;&gt;Enderby -->
<g id="edge5" class="edge">
<title>Collins-&gt;Enderby</title>
<path fill="none" stroke="black" d="M362.85,-481.29C360.87,-465.29 357.88,-441.2 355.54,-422.35"/>
<polygon fill="black" stroke="black" points="359.04,-422.13 354.34,-412.63 352.09,-422.99 359.04,-422.13"/>
<text xml:space="preserve" text-anchor="middle" x="416.81" y="-454.6" font-family="Helvetica,sans-Serif" font-size="10.00">Advises caution/'Cousins'</text>
</g>
<!-- Lacon -->
<g id="node3" class="node">
<title>Lacon</title>
<polygon fill="#b3e5fc" stroke="black" points="639.26,-410.8 442.74,-410.8 442.74,-374.8 639.26,-374.8 639.26,-410.8"/>
<text xml:space="preserve" text-anchor="middle" x="541" y="-388.6" font-family="Helvetica,sans-Serif" font-size="14.00">Oliver Lacon (Cabinet Office)</text>
</g>
<!-- Lacon&#45;&gt;Smiley -->
<g id="edge3" class="edge">
<title>Lacon-&gt;Smiley</title>
<path fill="none" stroke="black" d="M532.12,-374.49C525.78,-364.03 516.21,-351.47 504,-344.8 461.29,-321.48 339.43,-313.53 248.18,-310.91"/>
<polygon fill="black" stroke="black" points="248.53,-307.42 238.44,-310.65 248.35,-314.42 248.53,-307.42"/>
<text xml:space="preserve" text-anchor="middle" x="577.67" y="-347.8" font-family="Helvetica,sans-Serif" font-size="10.00">Orders 'cleanup' (deniable)</text>
</g>
<!-- Maria -->
<g id="node4" class="node">
<title>Maria</title>
<polygon fill="#bbdefb" stroke="black" points="781.35,-517.6 662.65,-517.6 662.65,-481.6 781.35,-481.6 781.35,-517.6"/>
<text xml:space="preserve" text-anchor="middle" x="722" y="-495.4" font-family="Helvetica,sans-Serif" font-size="14.00">Maria Ostrakova</text>
</g>
<!-- Vladimir -->
<g id="node5" class="node">
<title>Vladimir</title>
<polygon fill="#bbdefb" stroke="black" points="1029.13,-517.6 908.87,-517.6 908.87,-481.6 1029.13,-481.6 1029.13,-517.6"/>
<text xml:space="preserve" text-anchor="middle" x="969" y="-495.4" font-family="Helvetica,sans-Serif" font-size="14.00">General Vladimir</text>
</g>
<!-- Maria&#45;&gt;Vladimir -->
<g id="edge1" class="edge">
<title>Maria-&gt;Vladimir</title>
<path fill="none" stroke="black" d="M781.79,-499.6C816.6,-499.6 860.7,-499.6 897.36,-499.6"/>
<polygon fill="black" stroke="black" points="896.96,-503.1 906.96,-499.6 896.96,-496.1 896.96,-503.1"/>
<text xml:space="preserve" text-anchor="middle" x="845.11" y="-505.6" font-family="Helvetica,sans-Serif" font-size="10.00">Reports Soviet approach</text>
</g>
<!-- Vladimir&#45;&gt;Lacon -->
<g id="edge2" class="edge">
<title>Vladimir-&gt;Lacon</title>
<path fill="none" stroke="black" d="M908.59,-483.81C833.94,-465.53 706.59,-434.35 623.12,-413.91"/>
<polygon fill="black" stroke="black" points="624.17,-410.56 613.62,-411.58 622.5,-417.36 624.17,-410.56"/>
<text xml:space="preserve" text-anchor="middle" x="857.25" y="-454.6" font-family="Helvetica,sans-Serif" font-size="10.00">Demands contact</text>
</g>
<!-- Smiley&#45;&gt;Enderby -->
<g id="edge6" class="edge">
<title>Smiley-&gt;Enderby</title>
<path fill="none" stroke="black" d="M230.29,-311.78C286.76,-315.16 351.85,-323.69 370,-344.8 374.9,-350.5 374.48,-357.67 371.75,-364.69"/>
<polygon fill="black" stroke="black" points="368.77,-362.85 367.18,-373.32 374.95,-366.12 368.77,-362.85"/>
<text xml:space="preserve" text-anchor="middle" x="436.85" y="-347.8" font-family="Helvetica,sans-Serif" font-size="10.00">Seeks authorization for Bern</text>
</g>
<!-- Esterhase -->
<g id="node9" class="node">
<title>Esterhase</title>
<polygon fill="#ffe082" stroke="black" points="194.02,-220 79.98,-220 79.98,-184 194.02,-184 194.02,-220"/>
<text xml:space="preserve" text-anchor="middle" x="137" y="-197.8" font-family="Helvetica,sans-Serif" font-size="14.00">Toby Esterhase</text>
</g>
<!-- Smiley&#45;&gt;Esterhase -->
<g id="edge9" class="edge">
<title>Smiley-&gt;Esterhase</title>
<path fill="none" stroke="black" d="M110.46,-295.32C101.37,-289.81 92.37,-282.38 87.29,-272.8 78.91,-257.02 89.33,-240.69 102.76,-227.79"/>
<polygon fill="black" stroke="black" points="105.02,-230.46 110.22,-221.24 100.4,-225.2 105.02,-230.46"/>
<text xml:space="preserve" text-anchor="middle" x="135.64" y="-263.8" font-family="Helvetica,sans-Serif" font-size="10.00">Directs field operation</text>
</g>
<!-- Karla -->
<g id="node12" class="node">
<title>Karla</title>
<polygon fill="#e53935" stroke="black" points="348,-220 294,-220 294,-184 348,-184 348,-220"/>
<text xml:space="preserve" text-anchor="middle" x="321" y="-197.8" font-family="Helvetica,sans-Serif" font-size="14.00" fill="white">Karla</text>
</g>
<!-- Smiley&#45;&gt;Karla -->
<g id="edge13" class="edge">
<title>Smiley-&gt;Karla</title>
<path fill="none" stroke="black" d="M200.41,-300.78C239.15,-295.17 284.52,-286.04 299,-272.8 310.5,-262.29 316.03,-245.82 318.68,-231.53"/>
<polygon fill="black" stroke="black" points="322.13,-232.1 320.07,-221.7 315.2,-231.11 322.13,-232.1"/>
<text xml:space="preserve" text-anchor="middle" x="357.38" y="-263.8" font-family="Helvetica,sans-Serif" font-size="10.00">Sends ultimatum letter</text>
</g>
<!-- Connie -->
<g id="node7" class="node">
<title>Connie</title>
<polygon fill="white" stroke="black" points="119.58,-410.8 16.42,-410.8 16.42,-374.8 119.58,-374.8 119.58,-410.8"/>
<text xml:space="preserve" text-anchor="middle" x="68" y="-388.6" font-family="Helvetica,sans-Serif" font-size="14.00">Connie Sachs</text>
</g>
<!-- Connie&#45;&gt;Smiley -->
<g id="edge7" class="edge">
<title>Connie-&gt;Smiley</title>
<path fill="none" stroke="black" d="M52.86,-374.41C46.7,-365.14 42.32,-353.83 48.51,-344.8 55.3,-334.9 65.31,-327.8 76.23,-322.71"/>
<polygon fill="black" stroke="black" points="77.53,-325.96 85.5,-318.98 74.92,-319.47 77.53,-325.96"/>
<text xml:space="preserve" text-anchor="middle" x="93.26" y="-347.8" font-family="Helvetica,sans-Serif" font-size="10.00">Identifies Oleg Kirov</text>
</g>
<!-- Leipzig -->
<g id="node8" class="node">
<title>Leipzig</title>
<polygon fill="#ffcc80" stroke="black" points="228.35,-410.8 137.65,-410.8 137.65,-374.8 228.35,-374.8 228.35,-410.8"/>
<text xml:space="preserve" text-anchor="middle" x="183" y="-388.6" font-family="Helvetica,sans-Serif" font-size="14.00">Otto Leipzig</text>
</g>
<!-- Leipzig&#45;&gt;Smiley -->
<g id="edge8" class="edge">
<title>Leipzig-&gt;Smiley</title>
<path fill="none" stroke="black" d="M160.35,-374.48C155.04,-369.35 149.93,-363.33 146.51,-356.8 143.54,-351.13 141.68,-344.58 140.53,-338.21"/>
<polygon fill="black" stroke="black" points="144.05,-338.15 139.33,-328.66 137.11,-339.02 144.05,-338.15"/>
<text xml:space="preserve" text-anchor="middle" x="196.26" y="-347.8" font-family="Helvetica,sans-Serif" font-size="10.00">Provides secret proofs</text>
</g>
<!-- Grigoriev -->
<g id="node10" class="node">
<title>Grigoriev</title>
<polygon fill="white" stroke="black" points="382.63,-136 269.37,-136 269.37,-100 382.63,-100 382.63,-136"/>
<text xml:space="preserve" text-anchor="middle" x="326" y="-113.8" font-family="Helvetica,sans-Serif" font-size="14.00">Anton Grigoriev</text>
</g>
<!-- Esterhase&#45;&gt;Grigoriev -->
<g id="edge10" class="edge">
<title>Esterhase-&gt;Grigoriev</title>
<path fill="none" stroke="black" d="M177.08,-183.61C205.77,-171.16 244.62,-154.31 275.44,-140.94"/>
<polygon fill="black" stroke="black" points="276.81,-144.16 284.59,-136.97 274.02,-137.74 276.81,-144.16"/>
<text xml:space="preserve" text-anchor="middle" x="286.72" y="-157" font-family="Helvetica,sans-Serif" font-size="10.00">Blackmails/Coerces</text>
</g>
<!-- Grigoriev&#45;&gt;Smiley -->
<g id="edge12" class="edge">
<title>Grigoriev-&gt;Smiley</title>
<path fill="none" stroke="black" d="M348.53,-136.43C384.94,-166.64 448.98,-229.62 411,-272.8 398.76,-286.72 300.72,-296.66 225.83,-302.31"/>
<polygon fill="black" stroke="black" points="225.72,-298.8 216,-303.03 226.23,-305.79 225.72,-298.8"/>
<text xml:space="preserve" text-anchor="middle" x="472.5" y="-199" font-family="Helvetica,sans-Serif" font-size="10.00">Confesses Karla's role</text>
</g>
<!-- Alexandra -->
<g id="node11" class="node">
<title>Alexandra</title>
<polygon fill="#f48fb1" stroke="black" points="447.48,-52 308.52,-52 308.52,-16 447.48,-16 447.48,-52"/>
<text xml:space="preserve" text-anchor="middle" x="378" y="-29.8" font-family="Helvetica,sans-Serif" font-size="14.00">Alexandra (Tatiana)</text>
</g>
<!-- Grigoriev&#45;&gt;Alexandra -->
<g id="edge11" class="edge">
<title>Grigoriev-&gt;Alexandra</title>
<path fill="none" stroke="black" d="M323.12,-99.93C322.38,-90.55 322.9,-79.03 327.84,-70 329.84,-66.34 332.41,-62.97 335.33,-59.9"/>
<polygon fill="black" stroke="black" points="337.42,-62.73 342.57,-53.47 332.77,-57.49 337.42,-62.73"/>
<text xml:space="preserve" text-anchor="middle" x="370.92" y="-73" font-family="Helvetica,sans-Serif" font-size="10.00">Handles funds/care</text>
</g>
<!-- Karla&#45;&gt;Smiley -->
<g id="edge15" class="edge">
<title>Karla-&gt;Smiley</title>
<path fill="none" stroke="black" d="M303.86,-220.36C291.81,-231.48 274.73,-245.21 257,-252.8 234.82,-262.3 225.62,-251.64 203.3,-260.8 199.05,-262.54 181.88,-275.15 166.35,-286.86"/>
<polygon fill="black" stroke="black" points="164.57,-283.82 158.72,-292.65 168.8,-289.4 164.57,-283.82"/>
<text xml:space="preserve" text-anchor="middle" x="249.15" y="-263.8" font-family="Helvetica,sans-Serif" font-size="10.00">Defects (Final Node)</text>
</g>
<!-- Karla&#45;&gt;Alexandra -->
<g id="edge14" class="edge">
<title>Karla-&gt;Alexandra</title>
<path fill="none" stroke="black" d="M344.95,-183.57C360.07,-171.58 379.11,-154.52 392,-136 406.81,-114.73 409.02,-107.43 414,-82 415.03,-76.77 416.08,-74.91 414,-70 412.65,-66.81 410.86,-63.77 408.78,-60.9"/>
<polygon fill="black" stroke="black" points="411.61,-58.82 402.42,-53.55 406.31,-63.4 411.61,-58.82"/>
<text xml:space="preserve" text-anchor="middle" x="454.46" y="-115" font-family="Helvetica,sans-Serif" font-size="10.00">Sacrifices career for</text>
</g>
</g>
</svg>
`;

const cleanSvg = (svgString: string) => {
    return svgString
        .replace(/width="[\d\.]+(pt|px)"/g, "")
        .replace(/height="[\d\.]+(pt|px)"/g, "");
};

export const getGraphSvg = createServerFn({ method: "GET" })
    .inputValidator((d: { type: string, id: string }) => d)
    .handler(async ({ data }): Promise<string> => {
        if (data.type !== "book" && data.type !== "movie") {
            throw new Error("SVG ERROR");
        }

        const svg = cleanSvg(svgTest);
        // return svg;
        return new Promise((resolve) => setTimeout(() => resolve(svg), 2000));
    });
