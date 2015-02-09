require 'sass'
require 'base64'

module Sass::Script::Functions

   def base64(path, mime_type = nil)
      path = path.value
      url = "url(data:#{compute_mime_type(path,mime_type)};base64,#{data(path)})"
      Sass::Script::String.new(url)
   end

   private
   def compute_mime_type(path, mime_type)
      return mime_type if mime_type
      case path
         when /\.png$/i
            'image/png'
         when /\.jpe?g$/i
            'image/jpeg'
         when /\.gif$/i
            'image/gif'
         when /\.woff$/i
            'application/x-font-woff;charset=utf-8'
         else
            raise "A mime type could not be determined for #{path}, please specify one explicitly."
      end
   end

   def data(path)
      if File.readable?(path)
         file = File.open(path, 'rb')
         Base64.strict_encode64(file.read)
      else
         raise "File not found or cannot be read: #{path}"
      end
   end
end