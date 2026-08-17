#let bg-primary = oklch(16%, 0.012, 260deg)
#let line-dim = oklch(26%, 0.018, 260deg)
#let text-main = oklch(99%, 0.004, 260deg)
#let text-muted = oklch(84%, 0.01, 260deg)

#let render(inputs) = {
    let title = inputs.at("title", default: "")
    let description = inputs.at("description", default: none)

    set par(leading: 1.2em)
    set page(margin: 50pt, fill: bg-primary)
    set text(font: "LXGW Bright", fill: text-main, size: 16pt)

    block(width: 100%, height: 100%, stroke: (paint: line-dim, thickness: 2pt))[
        // 顶部
        #place(top + left, dx: 40pt, dy: -28pt)[
            #box(fill: bg-primary, inset: (x: 15pt), height: 56pt)[
                #align(horizon)[
                    #grid(
                        columns: (auto, auto),
                        gutter: 12pt,
                        align: horizon,
                        image("../assets/avatar.png", height: 42pt, fit: "contain"),
                        text(size: 2em, weight: "regular", [SharpIce Home]),
                    )
                ]
            ]
        ]

        // 中间
        #place(horizon, pad(x: 60pt)[
            #block(width: 90%)[
                #text(size: 3em, weight: "bold", title)
                #if type(description) == str and description.trim() != "" [
                    #v(20pt)
                    #text(size: 1.5em, fill: text-muted, description)
                ]
            ]
        ])

        // 底部
        #place(bottom + right, dx: -40pt, dy: 20pt)[
            #box(fill: bg-primary, inset: (x: 15pt), height: 40pt)[
                #align(horizon, text(size: 1.5em, tracking: 4pt, fill: text-muted, [Nexus Network]))
            ]
        ]
    ]
}
