import React from 'react';
import { Segment, Container, Header } from 'semantic-ui-react';

var About = () => (
  <div>
    <Segment size='huge' textAlign='center' style={{minHeight: 700, padding: '1em 0em'}} vertical>
      <Container text>
        <Header
          as='h1'
          content='OccaFit'
          style={{ fontSize: '4em', fontWeight: 'normal', marginBottom: 0, marginTop: '1em' }}
        />
        <Header
          as='h2'
          content='OccaFit helps you form connections, find friends, and build community around fitness experiences'
          style={{ fontSize: '1.7em', fontWeight: 'normal' }}
        />
      </Container>
    </Segment>

  </div>
)

export default About;