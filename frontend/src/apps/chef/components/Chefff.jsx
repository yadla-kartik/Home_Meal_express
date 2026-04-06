import React from 'react'
import { motion } from 'framer-motion'
import { Layers, Clock3, Home, CheckCircle2, Unlock, ArrowRight } from 'lucide-react'

const flowSteps = [
  {
    num: '1',
    icon: Home,
    title: 'Share your kitchen details',
    desc: 'Add your chef profile, station coverage and required documents in one smooth flow.',
  },
  {
    num: '2',
    icon: CheckCircle2,
    title: 'Move into admin review',
    desc: 'Your details go straight into the approval queue. Most chefs hear back within 24 hrs.',
  },
  {
    num: '3',
    icon: Unlock,
    title: 'Unlock chef tools',
    desc: 'Menu setup, order management and full dashboard access open after approval automatically.',
  },
]

const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
}

const slideRight = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 },
  },
}

const stepVariants = {
  hidden: { opacity: 0, y: 8 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.35 + i * 0.13 },
  }),
}

function Chefff({ onRegisterClick }) {
  return (
    <div className="crs-wrap">
      <div className="crs-bg-grid" />
      <div className="crs-glow crs-glow-1" />
      <div className="crs-glow crs-glow-2" />

      <div className="crs-inner">
        <motion.div className="crs-left" variants={slideLeft} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div>
            <div className="crs-top-row">
              <div className="crs-label-pill"><Layers size={12} /><span>Chef Setup</span></div>
              <div className="crs-dot-wrap">
                <span className="crs-live-dot" />
                <span className="crs-dot-text">Registration required</span>
              </div>
            </div>

            <div className="crs-heading-block">
              <div className="crs-eyebrow">Complete your profile</div>
              <h1 className="crs-big-heading">
                One step to<br />
                <em className="crs-accent">unlock</em> your<br />
                full kitchen.
              </h1>
              <p className="crs-sub-text">
                You&apos;re inside the dashboard, but registration is still pending. Submit your details and your chef profile moves straight into admin review.
              </p>
            </div>

            <div className="crs-status-strip">
              <div className="crs-strip-icon"><Clock3 size={16} color="var(--theme-accent)" /></div>
              <div>
                <div className="crs-strip-t">Waiting on your registration</div>
                <div className="crs-strip-s">Admin review begins the moment you submit. Most profiles clear within 24 hours.</div>
              </div>
            </div>

            <div className="crs-stat-row">
              <div className="crs-stat-card">
                <div className="crs-stat-label">Current access</div>
                <div className="crs-stat-val">Signed in, pending registration</div>
              </div>
              <div className="crs-stat-card">
                <div className="crs-stat-label">Next milestone</div>
                <div className="crs-stat-val">Profile review can start</div>
              </div>
            </div>
          </div>

          <div className="crs-cta-row">
            <motion.button
              type="button"
              className="crs-cta-btn"
              onClick={onRegisterClick}
              whileHover={{ y: -2, boxShadow: '0 12px 32px rgba(249,115,22,0.4)' }}
              whileTap={{ scale: 0.97 }}
            >
              Register now
              <span className="crs-arrow-box"><ArrowRight size={11} color="#fff" /></span>
            </motion.button>
            <span className="crs-cta-note">Takes less than 5 minutes</span>
          </div>
        </motion.div>

        <motion.div className="crs-right" variants={slideRight} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <div className="crs-right-top">
            <div className="crs-right-label">Setup flow</div>
            <div className="crs-step-counter">3 steps</div>
          </div>

          <div className="crs-right-heading">What opens<br />after this</div>

          <div className="crs-flow-list">
            {flowSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div key={step.num} className="crs-flow-item" custom={i} variants={stepVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                  <div className="crs-num-col">
                    <div className="crs-flow-circle">{step.num}</div>
                    {i < flowSteps.length - 1 && <div className="crs-flow-line" />}
                  </div>
                  <div className="crs-flow-body">
                    <div className="crs-flow-icon-row">
                      <div className="crs-flow-icon"><Icon size={13} /></div>
                      <div className="crs-flow-title">{step.title}</div>
                    </div>
                    <div className="crs-flow-desc">{step.desc}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="crs-progress-section">
            <div className="crs-prog-meta">
              <span>Setup progress</span><span>Step 1 of 3</span>
            </div>
            <div className="crs-prog-track">
              <motion.div
                className="crs-prog-fill"
                initial={{ width: 0 }}
                whileInView={{ width: '35%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      <style>{`
        .crs-wrap{
          background:linear-gradient(145deg,#fff7ef 0%,#fff1e5 48%,#ffead7 100%);
          border:1px solid var(--theme-chip-border);
          border-radius:24px;
          overflow:hidden;
          font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
          position:relative;
          min-height:520px;
          box-shadow:var(--theme-shadow-card);
        }

        .crs-bg-grid{
          position:absolute;inset:0;
          background-image:
            linear-gradient(rgba(249,115,22,0.05) 1px,transparent 1px),
            linear-gradient(90deg,rgba(249,115,22,0.05) 1px,transparent 1px);
          background-size:48px 48px;
          pointer-events:none;
        }

        .crs-glow{position:absolute;border-radius:50%;pointer-events:none;animation:crs-breathe 5s ease-in-out infinite;}
        .crs-glow-1{width:500px;height:500px;background:radial-gradient(circle,rgba(249,115,22,0.14) 0%,transparent 65%);top:-120px;right:-120px;}
        .crs-glow-2{width:300px;height:300px;background:radial-gradient(circle,rgba(251,146,60,0.08) 0%,transparent 65%);bottom:-80px;left:100px;animation-delay:-2s;}
        @keyframes crs-breathe{0%,100%{opacity:.7;}50%{opacity:1;}}

        .crs-inner{position:relative;z-index:1;display:grid;grid-template-columns:1.1fr 0.9fr;min-height:520px;}
        @media(max-width:660px){.crs-inner{grid-template-columns:1fr;}}

        .crs-left{
          padding:40px 36px 40px 40px;
          border-right:1px solid rgba(249,115,22,0.12);
          display:flex;flex-direction:column;justify-content:space-between;
        }
        @media(max-width:660px){
          .crs-left{border-right:none;border-bottom:1px solid rgba(249,115,22,0.12);}
        }

        .crs-top-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:36px;flex-wrap:wrap;gap:10px;}

        .crs-label-pill{
          display:inline-flex;align-items:center;gap:7px;
          border:1px solid rgba(249,115,22,0.35);
          border-radius:999px;padding:5px 13px;
          font-size:10px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;
          color:var(--theme-accent);background:rgba(249,115,22,0.08);
        }
        .crs-dot-wrap{display:flex;align-items:center;gap:6px;}
        .crs-live-dot{
          width:7px;height:7px;border-radius:50%;
          background:var(--theme-accent);flex-shrink:0;display:block;
          animation:crs-dot-pulse 2s ease-in-out infinite;
        }
        @keyframes crs-dot-pulse{
          0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(249,115,22,0.4);}
          50%{opacity:.8;box-shadow:0 0 0 5px rgba(249,115,22,0);}
        }
        .crs-dot-text{font-size:11px;color:var(--theme-muted);font-weight:500;}

        .crs-heading-block{margin-bottom:28px;}
        .crs-eyebrow{
          font-size:11px;font-weight:700;letter-spacing:.22em;
          text-transform:uppercase;color:rgba(249,115,22,0.7);margin-bottom:14px;
        }
        .crs-big-heading{
          font-family:Georgia,'Times New Roman',serif;
          font-size:40px;line-height:1.05;color:var(--theme-text);letter-spacing:-0.5px;
        }
        @media(max-width:480px){.crs-big-heading{font-size:28px;}}
        .crs-accent{color:var(--theme-accent);font-style:italic;}
        .crs-sub-text{
          margin-top:16px;font-size:13px;line-height:1.8;
          color:var(--theme-muted);max-width:340px;
        }

        .crs-status-strip{
          background:rgba(249,115,22,0.07);
          border:1px solid rgba(249,115,22,0.18);
          border-radius:16px;padding:16px 18px;
          display:flex;align-items:center;gap:14px;
          margin-bottom:24px;position:relative;overflow:hidden;
        }
        .crs-status-strip::before{
          content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
          background:linear-gradient(to bottom,#f97316,#fb923c);
          border-radius:2px 0 0 2px;
        }
        .crs-strip-icon{
          width:38px;height:38px;border-radius:12px;flex-shrink:0;
          background:rgba(249,115,22,0.15);
          border:1px solid rgba(249,115,22,0.25);
          display:flex;align-items:center;justify-content:center;
        }
        .crs-strip-t{font-size:13px;font-weight:700;color:var(--theme-text);margin-bottom:3px;}
        .crs-strip-s{font-size:12px;color:var(--theme-muted);line-height:1.5;}

        .crs-stat-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:28px;}
        @media(max-width:480px){.crs-stat-row{grid-template-columns:1fr;}}
        .crs-stat-card{
          background:rgba(255,255,255,0.4);
          border:1px solid rgba(249,115,22,0.14);
          border-radius:14px;padding:14px 15px;
          backdrop-filter:blur(10px);
        }
        .crs-stat-label{
          font-size:9.5px;font-weight:700;letter-spacing:.18em;
          text-transform:uppercase;color:rgba(249,115,22,0.75);margin-bottom:6px;
        }
        .crs-stat-val{font-size:13px;font-weight:600;color:var(--theme-text);line-height:1.35;}

        .crs-cta-row{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
        .crs-cta-btn{
          display:inline-flex;align-items:center;gap:10px;
          background:linear-gradient(135deg,#f97316,#fb923c);
          color:#fff;border:none;border-radius:14px;padding:14px 24px;
          font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;
          font-size:14px;font-weight:700;cursor:pointer;
          transition:transform .2s ease,box-shadow .2s ease;
        }
        .crs-arrow-box{
          width:22px;height:22px;border-radius:7px;
          background:rgba(255,255,255,0.22);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
        }
        .crs-cta-note{font-size:11.5px;color:var(--theme-muted);font-weight:400;}

        .crs-right{padding:36px 32px;display:flex;flex-direction:column;}
        .crs-right-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;}
        .crs-right-label{font-size:10px;font-weight:700;letter-spacing:.2em;text-transform:uppercase;color:rgba(249,115,22,.6);}
        .crs-step-counter{font-size:11px;color:var(--theme-muted);font-weight:600;}
        .crs-right-heading{
          font-family:Georgia,'Times New Roman',serif;
          font-size:20px;color:var(--theme-text);margin-bottom:24px;line-height:1.25;
        }

        .crs-flow-list{display:flex;flex-direction:column;gap:0;}
        .crs-flow-item{display:flex;align-items:flex-start;}
        .crs-num-col{display:flex;flex-direction:column;align-items:center;width:44px;flex-shrink:0;}
        .crs-flow-circle{
          width:36px;height:36px;border-radius:50%;flex-shrink:0;
          display:flex;align-items:center;justify-content:center;
          border:1px solid rgba(249,115,22,0.2);
          background:rgba(249,115,22,0.06);
          font-family:Georgia,'Times New Roman',serif;
          font-size:14px;color:rgba(249,115,22,0.5);font-weight:700;
          transition:all .25s ease;
        }
        .crs-flow-item:hover .crs-flow-circle{
          background:rgba(249,115,22,0.18);
          border-color:rgba(249,115,22,0.55);
          color:var(--theme-accent);
        }
        .crs-flow-line{width:1px;flex:1;min-height:16px;background:rgba(249,115,22,0.1);margin:3px 0;}
        .crs-flow-body{flex:1;padding:0 0 20px 16px;}
        .crs-flow-item:last-child .crs-flow-body{padding-bottom:0;}
        .crs-flow-icon-row{display:flex;align-items:center;gap:10px;margin-bottom:7px;}
        .crs-flow-icon{
          width:30px;height:30px;border-radius:9px;
          background:rgba(255,255,255,0.4);
          border:1px solid rgba(249,115,22,0.12);
          display:flex;align-items:center;justify-content:center;flex-shrink:0;
          color:rgba(249,115,22,.7);transition:background .2s ease,border-color .2s ease;
        }
        .crs-flow-item:hover .crs-flow-icon{
          background:rgba(249,115,22,0.1);
          border-color:rgba(249,115,22,0.25);
        }
        .crs-flow-title{font-size:13.5px;font-weight:700;color:var(--theme-text);}
        .crs-flow-desc{font-size:12px;color:var(--theme-muted);line-height:1.65;}

        .crs-progress-section{margin-top:auto;padding-top:24px;border-top:1px solid rgba(249,115,22,.08);}
        .crs-prog-meta{display:flex;justify-content:space-between;font-size:11px;color:var(--theme-muted);font-weight:600;margin-bottom:8px;}
        .crs-prog-track{height:4px;background:rgba(249,115,22,0.08);border-radius:999px;overflow:hidden;}
        .crs-prog-fill{height:100%;background:linear-gradient(90deg,#f97316,#fb923c);border-radius:999px;}
      `}</style>
    </div>
  )
}

export default Chefff
