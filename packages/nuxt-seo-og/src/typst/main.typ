#import "templates/default.typ" as templates-default

#let route-templates = (
    "default": templates-default.render,
)

#let template-name = sys.inputs.at("template", default: "default")
#let render-style = route-templates.at(template-name, default: route-templates.at("default"))

#set page(width: 1200pt, height: 630pt)
#render-style(sys.inputs)
