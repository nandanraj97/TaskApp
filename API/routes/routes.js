const express = require('express');
const router = express.Router();
const controlModel = require('../models/controlModel');
const keyModel = require('../models/keyModels');

router.post('/acquire', (req, res) => {
  const { user } = req.body;
  const now = Date.now();

  controlModel.getControl((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const control = results[0];

    if (control.user && now - control.acquiredAt > 120000) {
      controlModel.releaseControl(() => {
        controlModel.updateControl(user, now, () => res.json({ success: true }));
      });
    } else if (!control.user) {
      controlModel.updateControl(user, now, () => res.json({ success: true }));
    } else {
      res.json({ success: false, control });
    }
  });
});

router.post('/release', (req, res) => {
  controlModel.releaseControl(() => res.json({ success: true }));
});

router.post('/update', (req, res) => {
  const { index, user } = req.body;

  keyModel.getKeyState(index, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const current = results[0]?.state;
    const newState = current === user ? null : user;

    keyModel.updateKeyState(index, newState, (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });

      controlModel.releaseControl(() => res.json({ success: true }));
    });
  });
});

router.get('/state', (req, res) => {
  const now = Date.now();

  controlModel.getControl((err, controlResults) => {
    if (err) return res.status(500).json({ error: err.message });
    const control = controlResults[0];

    const respondWithState = (ctrl) => {
      keyModel.getAllKeyStates((err2, keyResults) => {
        if (err2) return res.status(500).json({ error: err2.message });

        res.json({
          keys: keyResults.map(k => k.state),
          control: ctrl
        });
      });
    };

    if (control.user && now - control.acquiredAt > 120000) {
      controlModel.releaseControl(() => respondWithState({ user: null, acquiredAt: null }));
    } else {
      respondWithState(control);
    }
  });
});

module.exports = router;
