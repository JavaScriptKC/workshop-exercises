import nltk
import json
import fileinput

sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')

text = ''

for line in fileinput.input():
   text += line

sentences = nltk.sent_tokenize(text)
sentences = [nltk.word_tokenize(sent) for sent in sentences]
sentences = [nltk.pos_tag(sent) for sent in sentences]
chunked_sentences = nltk.batch_ne_chunk(sentences, binary=True)

def extract_entity_names(t):
    entity_names = []
    
    if hasattr(t, 'node') and t.node:
        if t.node == 'NE':
            entity_names.append(' '.join([child[0] for child in t]))
        else:
            for child in t:
                entity_names.extend(extract_entity_names(child))
                
    return entity_names
 
entity_names = []

for tree in chunked_sentences:
    entity_names.extend(extract_entity_names(tree))

print set(entity_names)
print json.dumps(sentences)