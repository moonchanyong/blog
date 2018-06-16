it's FP PAGE3

{{site.FP}}
{{site.FP.static_files}}


{% for post in {{site.collections}} %}

    post name {{ post.name }}

    post {{post}}
{% endfor %}

isText
