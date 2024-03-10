from flask import Flask, request, jsonify
from flask_cors import CORS
import argostranslate.package
import argostranslate.translate

argostranslate.package.update_package_index()
available_packages = argostranslate.package.get_available_packages()

installed_packages = set ()

def install_package (from_code, to_code):
    package_to_install = next(
        filter(
            lambda x: x.from_code == from_code and x.to_code == to_code, available_packages
        )
    )
    argostranslate.package.install_from_path(package_to_install.download())
    installed_packages.add ((from_code, to_code))
    print ("Installed new package:", installed_packages)

app = Flask (__name__)
CORS(app)

@app.route ("/", methods=['GET', 'POST'])
@app.route ("/index", methods=['GET', 'POST'])

def get_translation ():
    text = request.args.get ("q", default="I am a bear")
    from_code = request.args.get ("source", default="en")
    to_code = request.args.get ("target", default="es")

    if not (from_code, to_code) in installed_packages:
        install_package (from_code, to_code)

    # Translate
    translatedText = argostranslate.translate.translate(text, from_code, to_code)

    response = jsonify({'translation': translatedText})
    return response

# def get_info ():
#     requesting_languages = False
#     requesting_languages = request.args.get ("languages", default="False")

#     if requesting_languages == "False":
#         text = request.args.get ("q", default="I am a bear")
#         to_code = request.args.get ("target", default="es")
#     from_code = request.args.get ("source", default="en")

#     if requesting_languages:
#         languages = list (filter(
#             lambda x: x.from_code == from_code, available_packages
#         ))
#         languages = [{"code": language.from_code, "name": language.from_name} for language in languages]
#         return jsonify({'languages': languages})

#     if not (from_code, to_code) in installed_packages:
#         install_package (from_code, to_code)

#     # Translate
#     translatedText = argostranslate.translate.translate(text, from_code, to_code)
#     return jsonify({'translation': translatedText})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
