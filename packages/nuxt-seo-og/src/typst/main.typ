#import "templates/default.typ" as templates-default

#let template-name = sys.inputs.at("template", default: "default")

#let route-templates = (
    "default": templates-default.render,
)

#let render-style = route-templates.at(template-name, default: templates-default.render)

#render-style(sys.inputs)
