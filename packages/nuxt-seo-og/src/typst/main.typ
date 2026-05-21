#import "templates/default.typ" as templates-default

#let template-key = sys.inputs.at("template", default: "default")

#let route-templates = (
  "default": templates-default.render,
)

#let render-style = route-templates.at(template-key, default: templates-default.render)

#render-style(sys.inputs)
