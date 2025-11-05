  <script>
    // @ts-ignore
    import PubNav from "$lib/components/layouts/users/PubNav.svelte";
  </script>
  
    <PubNav></PubNav>
  <div class="about-wrapper">
    <div class="about-backdrop">
      <h1>About TitanX</h1>
      
      <div class="about-content">
        <p>
          TitanX is my Year 1 web development project from Otago Polytechnic, 
          showcasing API integration, routing, and component architecture. 
          As someone returning to fitness after a year, I built this to solve my 
          own problem: tracking workout progress effectively.
        </p>
        <p>
          The Greek theme reflects the discipline and strength I'm cultivating - 
          both in coding and at the gym. If this proves useful for my personal 
          training, I may expand it into a full public tool.
        </p>
        <p class="signature">— Clarissa Chua</p>
      </div>
    </div>
  </div>
  
  <style>
    .about-wrapper {
      display: grid;
      place-items: center;
        height: 88vh;
    }
  
    .about-backdrop {
      max-width: 600px;
      padding: 3em;
      color: white;
      text-align: center;
      background: rgba(0, 0, 0, 0.582);
      backdrop-filter: blur(12px);
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  
    h1 {
      font-size: 2.2em;
      margin-bottom: 1em;
      font-weight: 300;
      text-transform: uppercase;
      color: #f8f8f8;
    }
  
    .about-content {
      line-height: 1.7;
      font-size: 1.2em;
    }
  
    .about-content p {
      margin-bottom: 1.2em;
      color: rgba(255, 255, 255, 0.9);
    }
  
    .signature {
      font-style: italic;
      margin-top: 1.5em;
      display: inline-block;
      position: relative;
    }
  
    .signature::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -2px;
      width: 100%;
      height: 1px;
      background: linear-gradient(90deg, transparent, #dc8400, transparent);
    }
  </style>