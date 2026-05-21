#import "templates/default.typ" as t-default

#let title = sys.inputs.at("title", default: none)
#let description = sys.inputs.at("description", default: none)
#let template-key = sys.inputs.at("template", default: "default")

#let route-templates = (
  "default": t-default.render,
)

#let render-style = route-templates.at(template-key, default: t-default.render)

#render-style(title, description)
