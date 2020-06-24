#!/usr/bin/env osascript -l JavaScript

ObjC.import('stdlib')
ObjC.import('Foundation')

const print = function (msg) {
    $.NSFileHandle.fileHandleWithStandardOutput.writeData(
        $.NSString.alloc.initWithString(String(msg))
            .dataUsingEncoding($.NSUTF8StringEncoding)
    )
}

var args = $.NSProcessInfo.processInfo.arguments; // NSArray
var argv = [];
var argc = args.count;
for (var i = 4; i < argc; i++) {
  // skip 3-word run command at top and this file's name
  // console.log($(args.objectAtIndex(i)).js)       // print each argument
  argv.push(ObjC.unwrap(args.objectAtIndex(i))); // collect arguments
}

var km = Application("Keyboard Maestro");
var kme = Application('Keyboard Maestro Engine')

if (argv[0] === "--list") {
  items = [];
  km.macroGroups().forEach((group) => {
    group.macros().forEach((macro) => {
      items.push({
        uid: macro.id(),
        title: macro.name(),
        subtitle: group.name(),
        arg: macro.id(),
        autocomplete: macro.name(),
        icon: {
          path: "icon.png",
        },
      });
    });
  });
  print(JSON.stringify({ items: items }));
} else if (argv[0] == "--select") {
    const macroId = argv[1];
    km.activate();
    km.editmacro(macroId);
} else if (argv[0] == "--execute") {
    const macroId = argv[1];
    kme.doScript(macroId);
}