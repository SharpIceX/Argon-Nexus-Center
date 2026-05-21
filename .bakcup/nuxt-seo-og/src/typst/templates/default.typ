#let render(title, description) = {
  set page(width: 1200pt, height: 630pt, margin: (x: 80pt, y: 60pt), fill: rgb("#0f172a"))
  set text(font: ("Noto Sans SC", "Heiti SC"), fill: rgb("#f8fafc"))

  align(left + horizon)[
    #block(width: 90%)[
      #text(size: 56pt, weight: "bold")[#title]
      #v(30pt)
      #text(size: 26pt, fill: rgb("#94a3b8"))[#description]
    ]
  ]
}
