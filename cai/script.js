document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('character-form');
    const generateBtn = document.getElementById('generate-btn');
    const outputTextarea = document.getElementById('output');
    const copyBtn = document.getElementById('copy-btn');
    const enhanceBtn = document.getElementById('enhance-btn');
    const apiKey = 'AIzaSyDMg1b5j3E8u26uRLHbmGMH6Iiz0aQj6LU';

    // Create form fields dynamically
    fields.forEach(field => {
        const formGroup = document.createElement('div');
        formGroup.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', field.name.toLowerCase().replace(/ /g, '-'));
        label.textContent = field.name;

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
        } else {
            input = document.createElement('input');
            input.type = 'text';
        }
        input.id = field.name.toLowerCase().replace(/ /g, '-');
        input.name = field.name;
        input.placeholder = field.placeholder;

        formGroup.appendChild(label);
        formGroup.appendChild(input);
        form.appendChild(formGroup);
        // Add suggestion tags below textbox
        if (field.tags && field.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'tags-container';
            field.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                if (typeof tag === 'string') {
                    tagElement.textContent = tag;
                    tagElement.dataset.color = 'blue';
                } else {
                    tagElement.textContent = tag.text;
                    tagElement.dataset.color = tag.color;
                }
                tagElement.addEventListener('click', () => {
                    const textToAdd = typeof tag === 'string' ? tag : tag.text;
                    if (input.value) {
                        input.value += ', ' + textToAdd;
                    } else {
                        input.value = textToAdd;
                    }
                });
                tagsContainer.appendChild(tagElement);
            });
            // Insert tagsContainer after input
            form.appendChild(tagsContainer);
        }
    });

    generateBtn.addEventListener('click', () => {
        let definition = '{';
        const formElements = form.elements;

        fields.forEach((field, index) => {
            const input = formElements[field.name];
            const value = input.value.trim().replace(/"/g, '\\"'); // Escape double quotes
            definition += `${field.name}("${value}")`;
            if (index < fields.length - 1) {
                definition += '\n\n';
            }
        });

        definition += '}';
        outputTextarea.value = definition;
    });

    copyBtn.addEventListener('click', () => {
        outputTextarea.select();
        document.execCommand('copy');
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
            copyBtn.textContent = 'Copy to Clipboard';
        }, 2000);
    });

    enhanceBtn.addEventListener('click', async () => {
        const currentDefinition = outputTextarea.value;
        if (!currentDefinition.trim()) {
            alert('Please generate a definition first.');
            return;
        }

        enhanceBtn.disabled = true;
        enhanceBtn.textContent = 'Enhancing...';

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `Enhance the following character.ai definition, keeping the original format and structure. Make it more detailed and descriptive:\n\n${currentDefinition}`
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error('Failed to fetch from Gemini API.');
            }

            const data = await response.json();
            const enhancedText = data.candidates[0].content.parts[0].text;
            outputTextarea.value = enhancedText;

        } catch (error) {
            console.error('Error enhancing with AI:', error);
            alert('There was an error while enhancing the definition. Please check the console for details.');
        } finally {
            enhanceBtn.disabled = false;
            enhanceBtn.textContent = 'Enhance with AI';
        }
    });
});
